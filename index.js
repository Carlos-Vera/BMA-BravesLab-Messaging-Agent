// BravesLab Messaging Agent (MBA) - Archivo principal / Main file
// Versión 1.1.2 - Corregida y mejorada para compatibilidad total

require('dotenv').config();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const bodyParser = require('body-parser');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const axios = require('axios');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Detección de entorno / Environment detection
const isDocker = process.env.DOCKER_ENV === 'true' || fs.existsSync('/.dockerenv');
const isEasyPanel = process.env.EASYPANEL === 'true' || isDocker;

// Rutas adaptativas / Adaptive paths
const BASE_PATH = process.env.APP_BASE_PATH || __dirname;
const SESSION_PATH = path.join(BASE_PATH, '.wwebjs_auth');
const LOG_PATH = path.join(BASE_PATH, 'logs');

// Crear directorios si no existen / Create directories if they don't exist
[SESSION_PATH, LOG_PATH].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Sistema de logging unificado / Unified logging system
const log = (level, message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${process.env.CLIENT_ID}] [${level}] ${message}`;
  
  // Siempre a consola / Always to console
  console.log(logMessage);
  
  // También a archivo si está configurado / Also to file if configured
  if (process.env.LOG_TO_FILE === 'true') {
    try {
      fs.appendFileSync(
        path.join(LOG_PATH, `${process.env.CLIENT_ID}.log`),
        logMessage + '\n'
      );
    } catch (err) {
      console.error('Error escribiendo log a archivo:', err.message);
    }
  }
};

// Determinar URL del webhook según el entorno / Determine webhook URL by environment
const webhookUrl = process.env.NODE_ENV === 'production' 
  ? process.env.WEBHOOK_URL_PRODUCTION 
  : process.env.WEBHOOK_URL_TEST;

// Log del entorno actual / Log current environment
log('INFO', `Entorno: ${process.env.NODE_ENV || 'test'}`);
log('INFO', `Webhook URL: ${webhookUrl || 'No configurado'}`);
log('INFO', `Ejecutando en: ${isEasyPanel ? 'EasyPanel/Docker' : 'Shell'}`);

// Configuración adaptativa de Puppeteer / Adaptive Puppeteer configuration
const puppeteerConfig = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};

if (isDocker || isEasyPanel) {
  puppeteerConfig.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
  log('INFO', 'Usando Chromium del sistema para Docker/EasyPanel');
}

// Inicialización del cliente WhatsApp / WhatsApp client initialization
const client = new Client({
  authStrategy: new LocalAuth({ 
    clientId: process.env.CLIENT_ID,
    dataPath: SESSION_PATH
  }),
  puppeteer: puppeteerConfig
});

let clientReady = false;
let lastQR = '';

// Eventos del cliente / Client events
client.on('ready', () => {
  clientReady = true;
  log('SUCCESS', '✅ WhatsApp conectado y listo');
});

client.on('disconnected', (reason) => {
  clientReady = false;
  log('WARNING', `Cliente desconectado: ${reason}`);
  
  // Si la desconexión es por logout, reinicializar / If disconnected by logout, reinitialize
  if (reason === 'LOGOUT' || reason === 'NAVIGATION') {
    log('INFO', 'Reinicializando cliente...');
    setTimeout(() => {
      client.initialize();
    }, 5000);
  }
});

// Generación de código QR / QR code generation
client.on('qr', (qr) => {
  lastQR = qr;
  log('INFO', 'Nuevo código QR generado');
  qrcode.generate(qr, { small: true });
  log('INFO', `QR generado a las: ${new Date().toLocaleString()}`);
});

// Procesamiento de mensajes entrantes / Incoming message processing
client.on('message', async (msg) => {
  const { from, type } = msg;
  let payload = { 
    from, 
    type, 
    client: process.env.CLIENT_ID,
    timestamp: new Date().toISOString()
  };

  if (type === 'chat') {
    payload.text = msg.body;
  }

  // Manejo de archivos multimedia / Media handling
  if (msg.hasMedia) {
    try {
      const media = await msg.downloadMedia();
      payload.media = {
        mimetype: media.mimetype,
        filename: `media_${Date.now()}.${media.mimetype.split('/')[1]}`,
        data: media.data
      };
      log('INFO', `Media recibida de ${from}: ${payload.media.mimetype}`);
    } catch (err) {
      log('ERROR', `Error descargando media: ${err.message}`);
    }
  }

  // Envío al webhook si está configurado / Send to webhook if configured
  if (webhookUrl) {
    try {
      const webhookResponse = await axios.post(webhookUrl, payload, {
        timeout: 30000, // Timeout de 30 segundos
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': process.env.CLIENT_ID,
          'X-Environment': process.env.NODE_ENV || 'test'
        }
      });
      
      log('SUCCESS', `✅ Enviado a webhook (${process.env.NODE_ENV || 'test'})`);

      // Procesar respuesta del webhook / Process webhook response
      const { to, message, media } = webhookResponse.data;
      
      if (to) {
        const chatId = to.includes('@c.us') || to.includes('@g.us') ? to : `${to}@c.us`;

        // Enviar media si existe / Send media if exists
        if (media && media.data && media.mimetype) {
          const ext = mime.extension(media.mimetype);
          const file = new MessageMedia(
            media.mimetype, 
            media.data, 
            media.filename || `media.${ext}`
          );
          await client.sendMessage(chatId, file);
          log('SUCCESS', `Media enviada a ${chatId}`);
        }

        // Soporte para múltiples mensajes en array / Support for multiple messages in array
        if (message) {
          if (Array.isArray(message)) {
            for (const [index, item] of message.entries()) {
              if (typeof item === 'string') {
                await client.sendMessage(chatId, item);
                log('SUCCESS', `Mensaje ${index + 1}/${message.length} enviado a ${chatId}`);
                // Pequeña pausa entre mensajes para evitar límites
                if (index < message.length - 1) {
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              }
            }
          } else if (typeof message === 'string') {
            await client.sendMessage(chatId, message);
            log('SUCCESS', `Mensaje enviado a ${chatId}`);
          }
        }
      }
    } catch (err) {
      log('ERROR', `Error procesando webhook: ${err.message}`);
      if (err.response) {
        log('ERROR', `Respuesta del webhook: ${JSON.stringify(err.response.data)}`);
      }
    }
  }
});

// Manejo de errores de autenticación / Authentication error handling
client.on('auth_failure', (msg) => {
  log('ERROR', `Error de autenticación: ${msg}`);
  log('INFO', 'Eliminando sesión y reiniciando...');
  
  // Eliminar sesión corrupta / Remove corrupted session
  const sessionPath = path.join(SESSION_PATH, `session-${process.env.CLIENT_ID}`);
  if (fs.existsSync(sessionPath)) {
    fs.rmSync(sessionPath, { recursive: true, force: true });
  }
  
  setTimeout(() => {
    client.initialize();
  }, 3000);
});

client.on('authenticated', () => {
  log('SUCCESS', '✅ Autenticado correctamente');
});

// ===========================================
// API REST ENDPOINTS
// ===========================================

// Middleware de autenticación / Authentication middleware
const authenticateAPI = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid API Key',
      timestamp: new Date().toISOString()
    });
  }
  next();
};

// Endpoint principal para enviar mensajes / Main endpoint to send messages
app.post('/api/whatsapp', authenticateAPI, async (req, res) => {
  // Validación del cliente / Client validation
  if (!client) {
    log('ERROR', 'Cliente no está definido');
    return res.status(503).json({ error: 'WhatsApp client not initialized' });
  }

  if (!clientReady) {
    log('WARNING', 'Cliente no está listo');
    return res.status(503).json({ error: 'WhatsApp client not ready - check QR scan' });
  }

  // Verificar estado del cliente / Verify client state
  try {
    const clientInfo = await client.getState();
    if (clientInfo !== 'CONNECTED') {
      log('WARNING', `Cliente no conectado. Estado: ${clientInfo}`);
      return res.status(503).json({ 
        error: `WhatsApp client not connected. State: ${clientInfo}` 
      });
    }
  } catch (err) {
    log('ERROR', `Error verificando estado: ${err.message}`);
    return res.status(503).json({ error: 'WhatsApp client not accessible' });
  }

  let { to, text, media } = req.body;

  if (!to) {
    return res.status(400).json({ error: 'Missing "to" parameter' });
  }

  to = to.trim();
  let chatId = to;
  if (!chatId.includes('@c.us') && !chatId.includes('@g.us')) {
    chatId = `${chatId}@c.us`;
  }

  try {
    // Verificar si el usuario está registrado / Check if user is registered
    const isRegistered = await client.isRegisteredUser(chatId);
    if (!isRegistered) {
      log('WARNING', `ID no registrado: ${chatId}`);
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Enviar media si existe / Send media if exists
    if (media && media.data && media.mimetype) {
      const ext = mime.extension(media.mimetype);
      const file = new MessageMedia(
        media.mimetype, 
        media.data, 
        media.filename || `media.${ext}`
      );
      await client.sendMessage(chatId, file);
      log('SUCCESS', `✅ Media enviada a ${chatId}`);
    }

    // Enviar texto si existe / Send text if exists
    if (text) {
      await client.sendMessage(chatId, text);
      log('SUCCESS', `✅ Mensaje de texto enviado a ${chatId}`);
    }

    res.json({ 
      status: 'sent', 
      message: 'Message sent successfully',
      to: chatId,
      environment: process.env.NODE_ENV || 'test',
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    log('ERROR', `Error enviando mensaje a ${chatId}: ${err.message}`);
    res.status(500).json({ 
      error: err.message,
      details: 'Check server logs for more information'
    });
  }
});

// Endpoint de estado del sistema / System status endpoint
app.get('/api/whatsapp/status', authenticateAPI, async (req, res) => {
  try {
    let status = {
      clientExists: !!client,
      clientReady: clientReady,
      environment: process.env.NODE_ENV || 'test',
      platform: isEasyPanel ? 'EasyPanel/Docker' : 'Shell',
      webhookUrl: webhookUrl || null,
      timestamp: new Date().toISOString(),
      clientId: process.env.CLIENT_ID,
      version: '1.1.2'
    };

    if (client && clientReady) {
      try {
        const state = await client.getState();
        status.connectionState = state;
        status.isConnected = state === 'CONNECTED';
        
        if (state === 'CONNECTED' && client.info) {
          status.whatsappInfo = {
            number: client.info.wid.user,
            platform: client.info.platform
          };
        }
      } catch (err) {
        status.error = err.message;
        status.isConnected = false;
      }
    }

    res.json(status);
  } catch (err) {
    log('ERROR', `Error en status: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para reiniciar el cliente / Client restart endpoint
app.post('/api/whatsapp/reset', authenticateAPI, async (req, res) => {
  try {
    log('INFO', 'Reiniciando cliente por API...');
    
    clientReady = false;
    await client.destroy();
    
    setTimeout(() => {
      client.initialize();
    }, 2000);
    
    res.json({ 
      status: 'restarting', 
      message: 'Client restarting, check logs for QR code' 
    });
  } catch (err) {
    log('ERROR', `Error al reiniciar: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Página principal con QR / Main page with QR
app.get('/', async (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>MBA BravesLab - ${process.env.CLIENT_ID}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
          max-width: 400px;
        }
        h1 { color: #333; margin-bottom: 0.5rem; }
        h2 { color: #666; font-size: 1.2rem; font-weight: normal; }
        .status { 
          padding: 0.5rem 1rem; 
          border-radius: 20px; 
          display: inline-block;
          margin: 1rem 0;
          font-weight: 600;
        }
        .connected { background: #10b981; color: white; }
        .waiting { background: #f59e0b; color: white; }
        .info {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          text-align: left;
        }
        .info p { margin: 0.25rem 0; color: #4b5563; }
        .qr-container { margin: 2rem 0; }
        img { max-width: 280px; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>MBA BravesLab</h1>
        <h2>Agente de Mensajería Profesional</h2>
  `;

  if (!lastQR || clientReady) {
    res.send(html + `
        <div class="status connected">✅ WhatsApp Conectado</div>
        <div class="info">
          <p><strong>Cliente:</strong> ${process.env.CLIENT_ID}</p>
          <p><strong>Entorno:</strong> ${process.env.NODE_ENV || 'test'}</p>
          <p><strong>Plataforma:</strong> ${isEasyPanel ? 'EasyPanel/Docker' : 'Shell'}</p>
          <p><strong>Webhook:</strong> ${webhookUrl ? 'Configurado' : 'No configurado'}</p>
          <p><strong>Estado:</strong> Operativo</p>
        </div>
      </div>
    </body>
    </html>
    `);
  } else {
    try {
      const qrImage = await QRCode.toDataURL(lastQR);
      res.send(html + `
        <div class="status waiting">⏳ Esperando vinculación</div>
        <p>Escanea este código QR con WhatsApp:</p>
        <div class="qr-container">
          <img src="${qrImage}" alt="QR Code" />
        </div>
        <div class="info">
          <p><strong>1.</strong> Abre WhatsApp en tu teléfono</p>
          <p><strong>2.</strong> Ve a Configuración → Dispositivos vinculados</p>
          <p><strong>3.</strong> Toca "Vincular un dispositivo"</p>
          <p><strong>4.</strong> Escanea este código QR</p>
        </div>
      </div>
    </body>
    </html>
      `);
    } catch (err) {
      res.status(500).send('Error generando el QR');
    }
  }
});

// Health check endpoint para monitoreo / Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.json({ 
    status: clientReady ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor / Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  log('INFO', `===========================================`);
  log('INFO', `MBA BravesLab v1.1.2 iniciado`);
  log('INFO', `Servidor activo en puerto ${PORT}`);
  log('INFO', `Entorno: ${process.env.NODE_ENV || 'test'}`);
  log('INFO', `Plataforma: ${isEasyPanel ? 'EasyPanel/Docker' : 'Shell'}`);
  log('INFO', `Webhook: ${webhookUrl || 'No configurado'}`);
  log('INFO', `===========================================`);
});

// Manejo de señales para cierre limpio / Signal handling for clean shutdown
process.on('SIGINT', async () => {
  log('INFO', 'Recibida señal SIGINT, cerrando limpiamente...');
  await client.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  log('INFO', 'Recibida señal SIGTERM, cerrando limpiamente...');
  await client.destroy();
  process.exit(0);
});

// Inicializar el cliente WhatsApp / Initialize WhatsApp client
client.initialize()
  .then(() => log('INFO', 'Inicialización del cliente iniciada'))
  .catch(err => log('ERROR', `Error iniciando cliente: ${err.message}`));