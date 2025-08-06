# BravesLab Messaging Agent (MBA)

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![GitHub release](https://img.shields.io/github/release/Carlos-Vera/waw-braves-js.svg)](https://github.com/Carlos-Vera/waw-braves-js/releases)
[![GitHub issues](https://img.shields.io/github/issues/Carlos-Vera/waw-braves-js.svg)](https://github.com/Carlos-Vera/waw-braves-js/issues)

> **Agente de mensajeria profesional con webhook y API REST para integracion empresarial**

Un agente robusto y escalable para plataformas de mensajeria que permite automatizar conversaciones, integrar con sistemas de IA y gestionar multiples clientes desde una API REST completa.

## Opciones de Instalacion

### Instalacion Rapida con EasyPanel (Recomendada)

![EasyPanel](https://easypanel.io/img/logo_dark.svg)

**Para usuarios que priorizan simplicidad y rapidez de despliegue:**

- **Tiempo de instalacion**: 10-15 minutos
- **Conocimientos requeridos**: Basicos (DNS, formularios)
- **Mantenimiento**: Automatizado
- **SSL**: Automatico
- **Actualizaciones**: Automaticas

[**Ver Guia EasyPanel →**](DESPLIEGUE_EASYPANEL.md) | [**Guia Usuario Basico →**](GUIA_USUARIO_BASICO.md)

### Instalacion Manual (Shell)

**Para desarrolladores que requieren control total:**

- **Tiempo de instalacion**: 30-60 minutos
- **Conocimientos requeridos**: Avanzados (Linux, Node.js, PM2)
- **Mantenimiento**: Manual
- **Flexibilidad**: Maxima
- **Recursos**: Minimos

[**Ver Instalacion Manual →**](#instalacion-rapida)

### Comparativa: EasyPanel vs Shell

| Aspecto | EasyPanel | Shell |
|---------|-----------|--------|
| **Complejidad** | Baja | Alta |
| **Tiempo instalacion** | 10-15 min | 30-60 min |
| **Mantenimiento** | Automatizado | Manual |
| **Recursos servidor** | +15% overhead | Minimo |
| **Costo total/año** | $520-1,470 | $1,520-3,415 |
| **Ideal para** | Empresas, consultores | Desarrolladores, SysAdmins |

[**Ver Comparativa Completa →**](COMPARATIVA_MBA_SHELL_vs_EP.md)

---

## Disclaimer Legal

**IMPORTANTE:** Este proyecto es independiente y no esta afiliado, respaldado o patrocinado por Meta Platforms, Inc. o sus subsidiarias. Las marcas comerciales mencionadas son propiedad de sus respectivos duenos.

**DISCLAIMER EASYPANEL:** EasyPanel es una marca comercial independiente. Este template es desarrollado por BRAVES LAB LLC y no esta oficialmente respaldado por EasyPanel. El uso de logos y marcas es unicamente con fines informativos bajo uso justo.

Este software utiliza interfaces web publicas y esta destinado unicamente para:
- Uso educativo e investigacion
- Desarrollo y pruebas en entornos controlados
- Integraciones empresariales autorizadas

**RESPONSABILIDAD DEL USUARIO:** Los usuarios son completamente responsables de:
- Cumplir con todos los terminos de servicio aplicables
- Obtener las autorizaciones necesarias antes del uso comercial
- Respetar las politicas de las plataformas de mensajeria
- Usar el software de manera etica y legal

**USO BAJO SU PROPIO RIESGO:** BRAVES LAB LLC no se hace responsable del uso indebido de este software.

---

## Caracteristicas Principales

### Agente de Mensajeria Avanzado
- Conexion estable con **whatsapp-web.js**
- Manejo de **texto, imagenes, documentos y archivos multimedia**
- **QR automatico** para vinculacion
- **Reconexion automatica** y recuperacion de sesion
- **Multi-instancia** (varios numeros en el mismo servidor)

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

## Instalacion EasyPanel

### Prerrequisitos
- Servidor con EasyPanel instalado
- Dominio propio (ej: miempresa.com)
- Acceso al panel DNS del dominio

### Instalacion en 3 Pasos

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
   - **API Key**: Generar automaticamente
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
- **SSL**: Automatico con Let's Encrypt
- **Backup**: Volumenes persistentes

## Instalacion Rapida (Shell)

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
WEBHOOK_URL=https://tu-ia.com/webhook  # Opcional
TELEGRAM_BOT_TOKEN=tu-token-telegram   # Para alertas
TELEGRAM_CHAT_ID=tu-chat-id           # Para alertas
```

### 3. Iniciar
```bash
# Desarrollo
npm start

# Produccion con PM2
pm2 start index.js --name "agente-cliente"
pm2 save
pm2 startup
```

### 4. Vincular Plataforma de Mensajeria
1. **Abrir:** `http://tu-servidor:3000`
2. **Escanear QR** con la aplicacion movil → Dispositivos vinculados
3. **Listo!** El agente estara operativo

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
├── index.js                    # Aplicacion principal
├── package.json               # Dependencias y scripts
├── .env.example              # Plantilla de configuracion
├── Dockerfile                # Para despliegue EasyPanel
├── easypanel-template.json   # Template oficial EasyPanel
├── DESPLIEGUE_EASYPANEL.md   # Guia tecnica EasyPanel
├── GUIA_USUARIO_BASICO.md    # Guia usuarios no tecnicos
├── COMPARATIVA_MBA_SHELL_vs_EP.md # Comparativa detallada
├── alerts/                   # Scripts de monitoreo
│   ├── check_ws.sh          # Verificacion de estado
│   └── watchdog-demo.js     # Watchdog automatico
├── logs/                    # Archivos de log
└── docs/                   # Documentacion adicional
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

### v1.3.0 (Próximamente)
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

**Copyright (c) 2025 Carlos Vera - BRAVES LAB LLC**

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