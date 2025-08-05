// Paso 1: Crea un nuevo archivo llamado `index.js`

// 1.1 - Instala las dependencias si aún no lo hiciste:
// npm install whatsapp-web.js express body-parser axios mime-types dotenv qrcode-terminal

require('dotenv').config();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const bodyParser = require('body-parser');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode'); // Para generar imagen del QR en el navegador
const axios = require('axios');
const mime = require('mime-types');

const app = express();
app.use(bodyParser.json({ limit: '10mb' })); // Reducido para VPS pequeño
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const client = new Client({
  authStrategy: new LocalAuth({ clientId: process.env.CLIENT_ID }),
  puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

let clientReady = false;

// Extra: para estar seguro de iniciar el bot
client.on('ready', () => {
  clientReady = true;
  console.log(`[${process.env.CLIENT_ID}] ✅ WhatsApp conectado y listo`);
});

client.on('disconnected', (reason) => {
  clientReady = false;
  console.log(`[${process.env.CLIENT_ID}] 🔌 Cliente desconectado: ${reason}`);
  
  // Si la desconexión es por logout, reinicializar
  if (reason === 'LOGOUT' || reason === 'NAVIGATION') {
    console.log(`[${process.env.CLIENT_ID}] 🔄 Reinicializando cliente...`);
    setTimeout(() => {
      client.initialize();
    }, 5000);
  }
});

// Paso 2: Mostrar QR para escanear
let lastQR = '';

client.on('qr', (qr) => {
  lastQR = qr;
  console.log(`[${process.env.CLIENT_ID}] 📱 Escanea este código QR:`);
  qrcode.generate(qr, { small: true });
  console.log(`[${process.env.CLIENT_ID}] ⏰ QR generado a las: ${new Date().toLocaleString()}`);
});


// Paso 4: Cuando llega un mensaje entrante
client.on('message', async (msg) => {
  const { from, type } = msg;
  let payload = { from, type, client: process.env.CLIENT_ID };

  if (type === 'chat') payload.text = msg.body;

  if (msg.hasMedia) {
    try {
      const media = await msg.downloadMedia();
      payload.media = {
        mimetype: media.mimetype,
        filename: `media_${Date.now()}.${media.mimetype.split('/')[1]}`,
        data: media.data
      };
    } catch (err) {
      console.error(`[${process.env.CLIENT_ID}] ❌ Error al descargar media`, err.message);
    }
  }

  if (process.env.WEBHOOK_URL) {
    try {
      const webhookResponse = await axios.post(process.env.WEBHOOK_URL, payload);
      console.log(`[${process.env.CLIENT_ID}] ✅ Enviado a webhook`);

      const { to, message, media } = webhookResponse.data;
      const chatId = to.includes('@c.us') || to.includes('@g.us') ? to : `${to}@c.us`;

      if (media && media.data && media.mimetype) {
        const ext = mime.extension(media.mimetype);
        const file = new MessageMedia(media.mimetype, media.data, media.filename || `media.${ext}`);
        await client.sendMessage(chatId, file);
      }
      // Para soportar varios mensajes ********
      if (message) {
        if (Array.isArray(message)) {
            for (const item of message) {
            if (typeof item === 'string') {
                await client.sendMessage(chatId, item);
            }
            }
        } else if (typeof message === 'string') {
            await client.sendMessage(chatId, message);
        }
     }

      console.log(`[${process.env.CLIENT_ID}] ✅ Mensaje enviado desde respuesta del agente IA`);

    } catch (err) {
      console.error(`[${process.env.CLIENT_ID}] ❌ Error al procesar respuesta del webhook`, err.message);
    }
  }

});

// Paso 5: Endpoint para enviar mensajes desde N8N mediante la API BravesLab creada para el cliente
app.post('/api/whatsapp', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }

  // Validación más robusta del cliente
  if (!client) {
    console.error(`[${process.env.CLIENT_ID}] ❌ Cliente no está definido`);
    return res.status(503).json({ error: 'WhatsApp client not initialized' });
  }

  if (!clientReady) {
    console.error(`[${process.env.CLIENT_ID}] ❌ Cliente no está listo`);
    return res.status(503).json({ error: 'WhatsApp client not ready - check QR scan' });
  }

  // Verificar que el cliente esté completamente funcional
  try {
    const clientInfo = await client.getState();
    if (clientInfo !== 'CONNECTED') {
      console.error(`[${process.env.CLIENT_ID}] ❌ Cliente no conectado. Estado: ${clientInfo}`);
      return res.status(503).json({ error: `WhatsApp client not connected. State: ${clientInfo}` });
    }
  } catch (err) {
    console.error(`[${process.env.CLIENT_ID}] ❌ Error verificando estado del cliente:`, err.message);
    return res.status(503).json({ error: 'WhatsApp client not accessible' });
  }

  let { to, text, media } = req.body;

  if (!to) return res.status(400).json({ error: 'Missing "to" parameter' });

  to = to.trim();
  let chatId = to;
  if (!chatId.includes('@c.us') && !chatId.includes('@g.us')) {
    chatId = `${chatId}@c.us`;
  }

  try {
    // Verificar si el usuario está registrado
    const isRegistered = await client.isRegisteredUser(chatId);
    if (!isRegistered) {
      console.log(`[${process.env.CLIENT_ID}] ⚠️ ID no registrado: ${chatId}`);
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Validación del chat - con timeout para evitar bloqueos
    let chat;
    try {
      chat = await Promise.race([
        client.getChatById(chatId),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
      ]);
    } catch (chatErr) {
      console.error(`[${process.env.CLIENT_ID}] ❌ Error accediendo al chat ${chatId}:`, chatErr.message);
      // Intentar enviar sin validar chat si el error es de timeout
      if (chatErr.message === 'Timeout') {
        console.log(`[${process.env.CLIENT_ID}] ⚠️ Timeout en getChatById, intentando envío directo`);
      } else {
        return res.status(404).json({ error: `Chat not accessible for ${chatId}` });
      }
    }

    // Enviar media si existe
    if (media && media.data && media.mimetype) {
      const ext = mime.extension(media.mimetype);
      const file = new MessageMedia(media.mimetype, media.data, media.filename || `media.${ext}`);
      await client.sendMessage(chatId, file);
      console.log(`[${process.env.CLIENT_ID}] ✅ Media enviado a ${chatId}`);
    }

    // Enviar texto si existe
    if (text) {
      await client.sendMessage(chatId, text);
      console.log(`[${process.env.CLIENT_ID}] ✅ Mensaje de texto enviado a ${chatId}`);
    }

    res.json({ 
      status: 'sent', 
      message: 'Message sent successfully',
      to: chatId,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error(`[${process.env.CLIENT_ID}] ❌ Error al enviar mensaje a ${chatId}:`, err.message);
    res.status(500).json({ 
      error: err.message,
      details: 'Check server logs for more information'
    });
  }
});

// Endpoint para verificar el estado del cliente
app.get('/api/whatsapp/status', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }

  try {
    let status = {
      clientExists: !!client,
      clientReady: clientReady,
      timestamp: new Date().toISOString(),
      clientId: process.env.CLIENT_ID
    };

    if (client) {
      try {
        const state = await client.getState();
        status.connectionState = state;
        status.isConnected = state === 'CONNECTED';
        
        if (state === 'CONNECTED') {
          const info = client.info;
          status.whatsappInfo = {
            number: info ? info.wid.user : 'unknown',
            platform: info ? info.platform : 'unknown'
          };
        }
      } catch (err) {
        status.error = err.message;
        status.isConnected = false;
      }
    }

    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para regenerar QR en caso de desconexión
app.post('/api/whatsapp/reset', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }

  try {
    console.log(`[${process.env.CLIENT_ID}] 🔄 Reiniciando cliente por API...`);
    
    clientReady = false;
    await client.destroy();
    
    setTimeout(() => {
      client.initialize();
    }, 2000);
    
    res.json({ status: 'restarting', message: 'Client restarting, check logs for QR code' });
  } catch (err) {
    console.error(`[${process.env.CLIENT_ID}] ❌ Error al reiniciar:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Paso 6: Endpoint para mostrar el QR en el navegador
app.get('/', async (req, res) => {
  if (!lastQR) {
    return res.send('<h2>🤖 Bot operativo. No hay QR disponible. Ya está vinculado o esperando...</h2>');
  }

  try {
    const qrImage = await QRCode.toDataURL(lastQR);
    res.send(`
      <h2>🤖 Escanea este código QR para vincular WhatsApp:</h2>
      <img src="${qrImage}" alt="QR Code" style="max-width:300px;" />
    `);
  } catch (err) {
    res.status(500).send('Error generando el QR');
  }
});

// Paso 6: Iniciar servidor y seleccionar puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));

// Manejar errores de autenticación
client.on('auth_failure', (msg) => {
  console.error(`[${process.env.CLIENT_ID}] ❌ Error de autenticación: ${msg}`);
  console.log(`[${process.env.CLIENT_ID}] 🔄 Eliminando sesión y reiniciando...`);
  
  // Eliminar sesión corrupta y reiniciar
  setTimeout(() => {
    client.initialize();
  }, 3000);
});

// Manejar cuando se necesita autenticación
client.on('authenticated', () => {
  console.log(`[${process.env.CLIENT_ID}] ✅ Autenticado correctamente`);
});

// Paso 7: Inicializar el cliente WhatsApp
client.initialize();