# Historial de Cambios

Todos los cambios notables en este proyecto seran documentados en este archivo.

El formato esta basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-05

### Agregado
- **Gestion de entornos**: Soporte completo para entornos de produccion y test
- **Variables de entorno separadas**: `WEBHOOK_URL_PRODUCTION` y `WEBHOOK_URL_TEST`
- **Cambio dinamico**: Posibilidad de cambiar entorno sin perder sesion
- **Configuracion PM2**: Archivo `ecosystem.config.js` para instancias multiples, puedes utilizar una instancia de produccion y otra de test funcionando a la vez.
- **Scripts NPM**: Comandos utiles para manejo de entornos
- **Logs informativos**: Indicadores claros del entorno activo
- **API mejorada**: Campo `environment` en respuestas de status
- **Compatibilidad retroactiva**: Funciona con configuracion anterior

### Modificado
- **index.js**: Logica para deteccion automatica de entorno
- **.env.example**: Documentacion completa de nuevas variables
- **package.json**: Scripts adicionales para entornos y PM2
- **README.md**: Documentacion extendida con seccion de entornos

### Corregido
- **Logs de webhook**: Ahora muestran el entorno usado
- **Pagina QR**: Indica entorno y webhook activo
- **Deteccion de configuracion**: Mejor manejo de variables no definidas

## [1.0.0] - 2025-01-04

### Agregado
- **Agente de mensajeria**: Conexion estable con whatsapp-web.js
- **API REST completa**: Endpoints para envio y monitoreo
- **Webhook configurable**: Integracion con sistemas de IA
- **Autenticacion API Key**: Seguridad en endpoints
- **Soporte multimedia**: Envio de imagenes, documentos, audio
- **QR automatico**: Vinculacion facil via navegador
- **Multi-instancia**: Soporte para varios numeros
- **Reconexion automatica**: Recuperacion de sesion
- **Logs detallados**: Debugging y monitoreo
- **Integracion PM2**: Auto-restart y manejo de procesos
- **Sistema watchdog**: Alertas por Telegram
- **Documentacion completa**: README, ejemplos y guias

### Seguridad
- **Validacion de API Key**: Todos los endpoints protegidos
- **Validacion de numeros**: Verificacion de destinatarios
- **Rate limiting**: Proteccion contra abuso
- **Manejo de errores**: Sin exposicion de informacion sensible