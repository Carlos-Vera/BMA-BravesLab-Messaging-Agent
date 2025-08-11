# BravesLab Messaging Agent (MBA)

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![GitHub release](https://img.shields.io/github/release/Carlos-Vera/waw-braves-js.svg)](https://github.com/Carlos-Vera/waw-braves-js/releases)
[![GitHub issues](https://img.shields.io/github/issues/Carlos-Vera/waw-braves-js.svg)](https://github.com/Carlos-Vera/waw-braves-js/issues)

> **Agente de mensajería profesional con webhook y API REST para integración empresarial**

Un agente robusto y escalable para plataformas de mensajería que permite automatizar conversaciones, integrar con sistemas de IA y gestionar múltiples clientes desde una API REST completa.

## Opciones de Instalación

### Instalación Rápida con EasyPanel (Recomendada)

<a href="https://easypanel.io" target="_blank">
  <img src="https://easypanel.io/img/logo_dark.svg" alt="Easy Panel" width="300" height="auto">
</a>

**Para usuarios que priorizan simplicidad y rapidez de despliegue:**

- **Tiempo de instalación**: 10-15 minutos
- **Conocimientos requeridos**: Básicos (DNS, formularios)
- **Mantenimiento**: Automatizado
- **SSL**: Automático
- **Actualizaciones**: Automáticas

[**Ver Guía EasyPanel →**](DESPLIEGUE_EASYPANEL.md) | [**Guía Usuario Básico →**](GUIA_USUARIO_BASICO.md)

### Instalación Manual (Shell)

**Para desarrolladores que requieren control total:**

- **Tiempo de instalación**: 30-60 minutos
- **Conocimientos requeridos**: Avanzados (Linux, Node.js, PM2)
- **Mantenimiento**: Manual
- **Flexibilidad**: Máxima
- **Recursos**: Mínimos

[**Ver Instalación Manual →**](#instalación-rápida)

### Comparativa: EasyPanel vs Shell

| Aspecto | EasyPanel | Shell |
|---------|-----------|--------|
| **Complejidad** | Baja | Alta |
| **Tiempo instalación** | 10-15 min | 30-60 min |
| **Mantenimiento** | Automatizado | Manual |
| **Recursos servidor** | +15% overhead | Mínimo |
| **Costo total/año** | $520-1,470 | $1,520-3,415 |
| **Ideal para** | Empresas, consultores | Desarrolladores, SysAdmins |

[**Ver Comparativa Completa →**](COMPARATIVA_MBA_SHELL_vs_EP.md)

---

## Disclaimer Legal

**IMPORTANTE:** Este proyecto es independiente y no está afiliado, respaldado o patrocinado por Meta Platforms, Inc. o sus subsidiarias. Las marcas comerciales mencionadas son propiedad de sus respectivos dueños.

**DISCLAIMER EASYPANEL:** EasyPanel es una marca comercial independiente. Este template es desarrollado por BRAVES LAB LLC y no está oficialmente respaldado por EasyPanel. El uso de logos y marcas es únicamente con fines informativos bajo uso justo.

Este software utiliza interfaces web públicas y está destinado únicamente para:
- Uso educativo e investigación
- Desarrollo y pruebas en entornos controlados
- Integraciones empresariales autorizadas

**RESPONSABILIDAD DEL USUARIO:** Los usuarios son completamente responsables de:
- Cumplir con todos los términos de servicio aplicables
- Obtener las autorizaciones necesarias antes del uso comercial
- Respetar las políticas de las plataformas de mensajería
- Usar el software de manera ética y legal

**USO BAJO SU PROPIO RIESGO:** BRAVES LAB LLC no se hace responsable del uso indebido de este software.

---

## Características Principales

### Agente de Mensajería Avanzado
- Conexión estable con **whatsapp-web.js**
- Manejo de **texto, imágenes, documentos y archivos multimedia**
- **QR automático** para vinculación
- **Reconexión automática** y recuperación de sesión
- **Multi-instancia** (varios números en el mismo servidor)

### Integración con IA
- **Webhook configurable** para envío a sistemas externos
- **Respuestas automáticas** desde IA (ChatGPT, n8n, etc.)
- **Procesamiento en tiempo real** de mensajes entrantes
- **Soporte para arrays de mensajes** múltiples

### API REST Completa
- **Envío de mensajes** programáticos
- **Autenticación con API Key** segura
- **Endpoints de estado** y monitoreo
- **Validación de números** automática
- **Logs detallados** y debugging

### Listo para Producción
- **Integración con PM2** para auto-restart
- **Sistema watchdog** con alertas por Telegram
- **Rate limiting** y validaciones
- **Manejo robusto de errores**
- **Configuración por variables de entorno**

## Instalación EasyPanel

### Prerrequisitos
- Servidor con EasyPanel instalado
- Dominio propio (ej: miempresa.com)
- Acceso al panel DNS del dominio

### Instalación en 3 Pasos

#### 1. Configurar DNS
En tu proveedor de dominio, agrega:
```
Tipo: A
Nombre: mba
Valor: [IP de tu servidor EasyPanel]
```
Resultado: `mba.tudominio.com`

#### 2. Importar Template
En EasyPanel:
1. New Project → Template
2. Importar desde: `https://raw.githubusercontent.com/Carlos-Vera/waw-braves-js/main/easypanel-template.json`
3. Completar formulario:
   - **Dominio**: tudominio.com
   - **API Key**: Generar automáticamente
   - **Webhook URL**: Opcional (para integraciones)

#### 3. Desplegar y Conectar
1. Click "Deploy" - esperar 5 minutos
2. Ir a `https://mba.tudominio.com`
3. Escanear QR con WhatsApp → Dispositivos Vinculados
4. Probar API: `https://mba.tudominio.com/api/whatsapp/status`

### Recursos EasyPanel
- **CPU**: 100m-500m (0.1-0.5 cores)
- **RAM**: 256-512MB
- **Almacenamiento**: 1.5GB (sesiones + logs)
- **SSL**: Automático con Let's Encrypt
- **Backup**: Volúmenes persistentes

## Instalación Rápida (Shell)

### Prerrequisitos
```bash
# Node.js 18+ y npm
node --version  # v18.17.0+
npm --version   # 9.0.0+

# PM2 (recomendado para producción)
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

### 2. Configuración Básica (.env)
```bash
PORT=3000
CLIENT_ID=mi-bot-empresa
API_KEY=tu-clave-super-segura-aqui
NODE_ENV=production  # o 'test' para desarrollo
WEBHOOK_URL_PRODUCTION=https://tu-ia.com/webhook/prod  # Opcional
WEBHOOK_URL_TEST=https://tu-ia.com/webhook/test       # Opcional
TELEGRAM_BOT_TOKEN=tu-token-telegram   # Para alertas
TELEGRAM_CHAT_ID=tu-chat-id           # Para alertas
```

### 3. Iniciar
```bash
# Desarrollo
npm start

# Producción con PM2
pm2 start index.js --name "agente-cliente"
pm2 save
pm2 startup
```

### 4. Vincular Plataforma de Mensajería
1. **Abrir:** `http://tu-servidor:3000`
2. **Escanear QR** con la aplicación móvil → Dispositivos vinculados
3. **¡Listo!** El agente estará operativo

## Gestión de Entornos

### Configuración Dual de Webhooks
El sistema soporta URLs separadas para producción y test:

```bash
# En tu archivo .env
NODE_ENV=production  # o 'test'
WEBHOOK_URL_PRODUCTION=https://api.tudominio.com/webhook
WEBHOOK_URL_TEST=https://test-api.tudominio.com/webhook
```

### Cambio de Entorno
- **Shell**: Editar `.env` y reiniciar con PM2
- **EasyPanel**: Cambiar variable en interfaz web (sin perder sesión WhatsApp)

El agente selecciona automáticamente el webhook correcto según `NODE_ENV`.

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

## Configuración Avanzada

### Multi-instancia
```bash
# Cliente 1
CLIENT_ID=cliente1 PORT=3001 node index.js

# Cliente 2  
CLIENT_ID=cliente2 PORT=3002 node index.js
```

### Webhook con IA
```javascript
// El bot enviará automáticamente:
{
  "from": "1234567890@c.us",
  "type": "chat",
  "text": "Mensaje del usuario",
  "client": "mi-bot-empresa",
  "timestamp": "2025-01-01T10:00:00Z"
}

// Tu IA debe responder:
{
  "to": "1234567890",
  "message": "Respuesta de la IA"
  // o "message": ["Mensaje 1", "Mensaje 2"] para múltiples
}
```

### Alertas por Telegram
```bash
# Configurar watchdog (opcional)
*/5 * * * * node /ruta/alerts/watchdog-demo.js
```

## Documentación

### Estructura del Proyecto
```
waw-braves-js/
├── index.js                    # Aplicación principal
├── package.json               # Dependencias y scripts
├── .env.example              # Plantilla de configuración
├── ecosystem.config.js       # Configuración PM2
├── Dockerfile                # Para despliegue EasyPanel
├── easypanel-template.json   # Template oficial EasyPanel
├── DESPLIEGUE_EASYPANEL.md   # Guía técnica EasyPanel
├── GUIA_USUARIO_BASICO.md    # Guía usuarios no técnicos
├── COMPARATIVA_MBA_SHELL_vs_EP.md # Comparativa detallada
├── alerts/                   # Scripts de monitoreo
│   ├── check_ws.sh          # Verificación de estado
│   └── watchdog-demo.js     # Watchdog automático
├── logs/                    # Archivos de log
└── docs/                   # Documentación adicional
```

### Endpoints de la API
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/whatsapp` | Enviar mensaje |
| `GET` | `/api/whatsapp/status` | Estado del bot |
| `POST` | `/api/whatsapp/reset` | Reiniciar cliente |
| `GET` | `/` | Ver QR de vinculación |
| `GET` | `/health` | Health check |

### Códigos de Respuesta
- `200` - Éxito
- `400` - Petición inválida
- `401` - API Key inválida
- `404` - Destinatario no encontrado
- `503` - Cliente no conectado

## Solución de Problemas

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
1. Verificar que el puerto esté libre
2. Comprobar configuración de CLIENT_ID
3. Eliminar carpeta `.wwebjs_auth` y reiniciar

### Webhook no funciona
1. Verificar que la URL del webhook sea accesible
2. Comprobar logs del servidor de destino
3. Probar manualmente el endpoint

## Uso Comercial

Este proyecto está bajo licencia **CC BY-NC-SA 4.0** (no comercial).

### Uso Libre (No Comercial):
- Proyectos personales
- Investigación y educación
- ONGs y organizaciones sin fines de lucro
- Desarrollo y pruebas

### Licencia Comercial Disponible:
Si necesitas usar este agente para:
- Empresas y comercios
- Servicios de pago
- Productos comerciales
- Soporte técnico empresarial

**Contacta para licencia comercial:**
- **Email:** hello@braveslab.com
- **Website:** braveslab.com

**Ofrecemos:**
- Licencias comerciales flexibles
- Acuerdos de regalías justos
- Soporte técnico especializado
- Desarrollo de funcionalidades personalizadas
- Consultoría de implementación

## Contribuir

Las contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

### Formas de Contribuir:
- Reportar errores
- Proponer nuevas características
- Mejorar documentación
- Escribir pruebas
- Traducciones

## Hoja de Ruta

### v1.3.0 (Próximamente)
- [ ] Panel web de administración
- [ ] Soporte para grupos
- [ ] Plantillas de mensajes
- [ ] Métricas y analíticas

### v1.2.0
- [ ] Chatbots con flujos visuales
- [ ] Integración con CRM
- [ ] API GraphQL
- [ ] Multi-tenant SaaS

## Contribuyentes

Un agradecimiento especial a todos los que hacen posible este proyecto:

<!-- Será actualizado automáticamente -->
- Tu nombre aparecerá aquí al contribuir

## Licencia

Este proyecto está licenciado bajo **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International**.

[![License: CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

### Resumen de la Licencia:
- **Compartir** - copiar y redistribuir
- **Adaptar** - remix, transformar y construir sobre el material
- **No Comercial** - no usar para fines comerciales
- **Compartir Igual** - usar la misma licencia para derivados
- **Atribución** - dar crédito apropiado

**Copyright (c) 2025 Carlos Vera - BRAVES LAB LLC**

---

## ¿Te Gusta el Proyecto?

Si este proyecto te resulta útil:

- **Dale una estrella** en GitHub
- **Reporta errores** que encuentres
- **Sugiere mejoras** 
- **Contribuye** con código
- **Compártelo** con otros desarrolladores

---

**Hecho con amor para la comunidad de código abierto**

**¿Preguntas?** Abre un [issue](https://github.com/Carlos-Vera/waw-braves-js/issues) o contáctanos directamente!