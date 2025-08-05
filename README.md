# BravesLab Messaging Agent (BMA)

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![GitHub release](https://img.shields.io/github/release/Carlos-Vera/waw-braves-js.svg)](https://github.com/Carlos-Vera/waw-braves-js/releases)
[![GitHub issues](https://img.shields.io/github/issues/Carlos-Vera/waw-braves-js.svg)](https://github.com/Carlos-Vera/waw-braves-js/issues)

> **Agente de mensajeria profesional con webhook y API REST para integracion empresarial**

Un agente robusto y escalable para plataformas de mensajeria que permite automatizar conversaciones, integrar con sistemas de IA y gestionar multiples clientes desde una API REST completa.

## Disclaimer Legal

**IMPORTANTE:** Este proyecto es independiente y no esta afiliado, respaldado o patrocinado por Meta Platforms, Inc. o sus subsidiarias. Las marcas comerciales mencionadas son propiedad de sus respectivos duenos.

Este software utiliza interfaces web publicas y esta destinado unicamente para:
- Uso educativo e investigacion
- Desarrollo y pruebas en entornos controlados
- Integraciones empresariales autorizadas

**RESPONSABILIDAD DEL USUARIO:** Los usuarios son completamente responsables de:
- Cumplir con todos los terminos de servicio aplicables
- Obtener las autorizaciones necesarias antes del uso comercial
- Respetar las politicas de las plataformas de mensajeria
- Usar el software de manera etica y legal

**USO BAJO SU PROPIO RIESGO:** BravesLab no se hace responsable del uso indebido de este software.

---

## Caracteristicas Principales

### Agente de Mensajeria Avanzado
- Conexion estable con **whatsapp-web.js**
- Manejo de **texto, imagenes, documentos y archivos multimedia**
- **QR automatico** para vinculacion
- **Reconexion automatica** y recuperacion de sesion
- **Multi-instancia** (varios numeros en el mismo servidor)

### Gestion de Entornos
- **Configuracion separada** para produccion y test
- **Cambio dinamico** entre entornos
- **URLs de webhook** especificas por entorno
- **Instancias PM2** independientes

### Integracion con IA
- **Webhook configurable** para envio a sistemas externos
- **Respuestas automaticas** desde IA (ChatGPT, n8n, etc.)
- **Procesamiento en tiempo real** de mensajes entrantes
- **Soporte para arrays de mensajes** multiples

### API REST Completa
- **Envio de mensajes** programaticos
- **Autenticacion con API Key** segura
- **Endpoints de estado** y monitoreo
- **Validacion de numeros** automatica
- **Logs detallados** y debugging

### Listo para Produccion
- **Integracion con PM2** para auto-restart
- **Sistema watchdog** con alertas por Telegram
- **Rate limiting** y validaciones
- **Manejo robusto de errores**
- **Configuracion por variables de entorno**

## Instalacion Rapida

### Prerrequisitos
```bash
# Node.js 18+ y npm
node --version  # v18.17.0+
npm --version   # 9.0.0+

# PM2 (recomendado para produccion)
npm install -g pm2
```

### 1. Clonar y Configurar
```bash
# Clonar repositorio
git clone https://github.com/Carlos-Vera/waw-braves-js.git
cd waw-braves-js

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
nano .env  # Configurar PORT, CLIENT_ID, API_KEY, etc.
```

### 2. Configuracion Basica (.env)
```bash
PORT=3000
CLIENT_ID=mi-bot-empresa
API_KEY=tu-clave-super-segura-aqui

# Configuracion de entornos
NODE_ENV=test
WEBHOOK_URL_PRODUCTION=https://api.empresa.com/webhook
WEBHOOK_URL_TEST=https://test-api.empresa.com/webhook

# Alertas opcionales
TELEGRAM_BOT_TOKEN=tu-token-telegram
TELEGRAM_CHAT_ID=tu-chat-id
```

### 3. Iniciar
```bash
# Desarrollo
npm start

# Produccion con PM2
pm2 start ecosystem.config.js

# O instancia simple
pm2 start index.js --name "agente-cliente"
pm2 save
pm2 startup
```

### 4. Vincular Plataforma de Mensajeria
1. **Abrir:** `http://tu-servidor:3000`
2. **Escanear QR** con la aplicacion movil -> Dispositivos vinculados
3. **Listo!** El agente estara operativo

## Gestion de Entornos

BMA soporta configuracion separada para entornos de **produccion** y **test**, permitiendo cambiar facilmente entre diferentes webhooks y configuraciones mediante una sola instancia PM2.

### Configuracion de Entornos

En tu archivo `.env`, configura las URLs de webhook para cada entorno:

```bash
# Entorno actual (production/test)
NODE_ENV=production

# URLs de webhook por entorno
WEBHOOK_URL_PRODUCTION=https://api.empresa.com/webhook
WEBHOOK_URL_TEST=https://test-api.empresa.com/webhook

# Variable legacy (mantener por compatibilidad)
WEBHOOK_URL=https://api.empresa.com/webhook
```

### Cambio de Entorno

#### Metodo Principal: Edicion del archivo .env
```bash
# 1. Editar archivo .env
nano .env

# 2. Cambiar la variable NODE_ENV:
NODE_ENV=production  # Para produccion
NODE_ENV=test        # Para test

# 3. Reiniciar el proceso
pm2 restart mi-agente

# 4. Verificar cambio en logs
pm2 logs mi-agente --lines 5
```

#### Configuracion Requerida en .env
```bash
# Entorno actual
NODE_ENV=production

# URLs de webhook por entorno
WEBHOOK_URL_PRODUCTION=https://api.empresa.com/webhook
WEBHOOK_URL_TEST=https://test-api.empresa.com/webhook
```

#### Opcion Avanzada: Instancias separadas (ecosystem.config.js)
```bash
# Para usuarios que prefieran instancias multiples
pm2 start ecosystem.config.js

# Controlar instancias individualmente
pm2 restart mi-agente-production
pm2 restart mi-agente-test
```

### Verificacion del Entorno

El agente muestra informacion del entorno activo:

- **En los logs:** Entorno: production/test
- **En la API status:** Campo `environment` en la respuesta
- **En el navegador:** Muestra el entorno en la pagina del QR

### Ejemplo de Respuesta API

```json
{
  "clientReady": true,
  "environment": "production",
  "webhookUrl": "https://api.empresa.com/webhook",
  "connectionState": "CONNECTED",
  "timestamp": "2025-01-XX..."
}
```

## Uso de la API

### Enviar Mensaje
```bash
curl -X POST http://localhost:3000/api/whatsapp \
  -H "Content-Type: application/json" \
  -H "x-api-key: tu-clave-api" \
  -d '{
    "to": "1234567890",
    "text": "Hola desde el agente!"
  }'
```

### Verificar Estado
```bash
curl -H "x-api-key: tu-clave-api" \
  http://localhost:3000/api/whatsapp/status
```

### Enviar Imagen
```bash
curl -X POST http://localhost:3000/api/whatsapp \
  -H "Content-Type: application/json" \
  -H "x-api-key: tu-clave-api" \
  -d '{
    "to": "1234567890",
    "text": "Mira esta imagen:",
    "media": {
      "mimetype": "image/jpeg",
      "data": "datos-imagen-base64",
      "filename": "imagen.jpg"
    }
  }'
```

## Configuracion Avanzada

### Multi-instancia
```bash
# Cliente 1
CLIENT_ID=cliente1 PORT=3001 node index.js

# Cliente 2  
CLIENT_ID=cliente2 PORT=3002 node index.js
```

### Webhook con IA
```javascript
// El bot enviara automaticamente:
{
  "from": "1234567890@c.us",
  "type": "chat",
  "text": "Mensaje del usuario",
  "client": "mi-bot-empresa"
}

// Tu IA debe responder:
{
  "to": "1234567890",
  "message": "Respuesta de la IA"
  // o "message": ["Mensaje 1", "Mensaje 2"] para multiples
}
```

### Alertas por Telegram
```bash
# Configurar watchdog (opcional)
*/5 * * * * node /ruta/alerts/watchdog-demo.js
```

## Documentacion

### Estructura del Proyecto
```
waw-braves-js/
├── index.js              # Aplicacion principal
├── package.json           # Dependencias y scripts
├── .env.example          # Plantilla de configuracion
├── ecosystem.config.js   # Configuracion PM2 (nuevo)
├── alerts/               # Scripts de monitoreo
│   ├── check_ws.sh      # Verificacion de estado
│   └── watchdog-demo.js # Watchdog automatico
├── logs/                 # Archivos de log
└── docs/                # Documentacion adicional
```

### Endpoints de la API
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| `POST` | `/api/whatsapp` | Enviar mensaje |
| `GET` | `/api/whatsapp/status` | Estado del bot |
| `POST` | `/api/whatsapp/reset` | Reiniciar cliente |
| `GET` | `/` | Ver QR de vinculacion |

### Codigos de Respuesta
- `200` - Exito
- `400` - Peticion invalida
- `401` - API Key invalida
- `404` - Destinatario no encontrado
- `503` - Cliente no conectado

## Solucion de Problemas

### Agente no conecta
```bash
# Verificar estado
pm2 status

# Ver logs
pm2 logs agente-cliente

# Reiniciar
pm2 restart agente-cliente
```

### QR no aparece
1. Verificar que el puerto este libre
2. Comprobar configuracion de CLIENT_ID
3. Eliminar carpeta `.wwebjs_auth` y reiniciar

### Webhook no funciona
1. Verificar que la URL del webhook sea accesible
2. Comprobar logs del servidor de destino
3. Probar manualmente el endpoint
4. Verificar que NODE_ENV apunte al entorno correcto

### Cambio de entorno no funciona
1. Verificar que las variables WEBHOOK_URL_* esten configuradas
2. Reiniciar PM2 tras cambiar NODE_ENV
3. Comprobar logs para confirmar el entorno activo

## Uso Comercial

Este proyecto esta bajo licencia **CC BY-NC-SA 4.0** (no comercial).

### Uso Libre (No Comercial):
- Proyectos personales
- Investigacion y educacion
- ONGs y organizaciones sin fines de lucro
- Desarrollo y pruebas

### Licencia Comercial Disponible:
Si necesitas usar este agente para:
- Empresas y comercios
- Servicios de pago
- Productos comerciales
- Soporte tecnico empresarial

**Contacta para licencia comercial:**
- **Email:** carlos@braveslab.com
- **WhatsApp:** +34 623 928 854
- **Website:** braveslab.com

**Ofrecemos:**
- Licencias comerciales flexibles
- Acuerdos de regalias justos
- Soporte tecnico especializado
- Desarrollo de funcionalidades personalizadas
- Consultoria de implementacion

## Contribuir

Las contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para mas detalles.

### Formas de Contribuir:
- Reportar errores
- Proponer nuevas caracteristicas
- Mejorar documentacion
- Escribir pruebas
- Traducciones

## Hoja de Ruta

### v1.1.0 (Proximamente)
- [x] Gestion de entornos production/test
- [ ] Panel web de administracion
- [ ] Soporte para grupos
- [ ] Plantillas de mensajes
- [ ] Metricas y analiticas

### v1.2.0
- [ ] Chatbots con flujos visuales
- [ ] Integracion con CRM
- [ ] API GraphQL
- [ ] Multi-tenant SaaS

## Contribuyentes

Un agradecimiento especial a todos los que hacen posible este proyecto:

<!-- Sera actualizado automaticamente -->
- Tu nombre aparecera aqui al contribuir

## Licencia

Este proyecto esta licenciado bajo **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International**.

[![License: CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

### Resumen de la Licencia:
- **Compartir** - copiar y redistribuir
- **Adaptar** - remix, transformar y construir sobre el material
- **No Comercial** - no usar para fines comerciales
- **Compartir Igual** - usar la misma licencia para derivados
- **Atribucion** - dar credito apropiado

**Para uso comercial, contacta:** carlos@braveslab.com

---

## Te Gusta el Proyecto?

Si este proyecto te resulta util:

- **Dale una estrella** en GitHub
- **Reporta errores** que encuentres
- **Sugiere mejoras** 
- **Contribuye** con codigo
- **Compartelo** con otros desarrolladores

---

**Hecho con amor para la comunidad de codigo abierto**

**Preguntas?** Abre un [issue](https://github.com/Carlos-Vera/waw-braves-js/issues) o contactanos directamente!