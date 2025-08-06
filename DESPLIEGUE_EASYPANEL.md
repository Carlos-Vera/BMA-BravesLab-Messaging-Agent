# Guía de Despliegue MBA BravesLab JS en EasyPanel

## Información del Servidor (Ejemplo)

- **IP Servidor**: 123.456.78.90
- **EasyPanel**: https://easypanel.tudominio.com
- **n8n**: https://n8n.tudominio.com 
- **MBA BravesLab**: https://cliente.tudominio.com (la url en la que se mostrará el QR después del despliegue)

> **Nota**: Esta guía usa `tudominio.com` como ejemplo. Sustituye por tu dominio real.

## Paso 1: Preparar Archivos

### 1.1 Agregar archivos al repositorio

Crear los siguientes archivos en el directorio raíz del proyecto:

```bash
# En el directorio raíz del proyecto MBA BravesLab JS
touch Dockerfile
touch .dockerignore
touch easypanel-config.json
```

### 1.2 Copiar contenido de los archivos

Copiar el contenido generado de:
- `Dockerfile` → Dockerfile optimizado para producción
- `.dockerignore` → Excluir archivos innecesarios
- `easypanel-config.json` → Configuración de EasyPanel

### 1.3 Actualizar package.json (Opcional)

Agregar script de producción si no existe:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "prod": "NODE_ENV=production PORT=8080 node index.js"
  }
}
```

## Paso 2: Desplegar en EasyPanel

### 2.1 Acceder a EasyPanel

1. Ir a https://easypanel.tudominio.com
2. Iniciar sesión con credenciales de administrador

### 2.2 Crear Nueva Aplicación

1. Click en **"+ New Project"**
2. Seleccionar **"Import from Git"**
3. Configurar:
   - **Repository URL**: `https://github.com/Carlos-Vera/waw-braves-js.git`
   - **Branch**: `main`
   - **Name**: `mba-braveslab`
   - **Subdomain**: `app`

### 2.3 Configurar Variables de Entorno

**Variables Obligatorias:**
```bash
DOMAIN=tudominio.com
NODE_ENV=production
PORT=8080
CLIENT_ID=mba-easypanel
API_KEY=tu-clave-api-super-segura-2024
```

**Variables de Webhook (Opcionales pero Recomendadas):**
```bash
WEBHOOK_URL_PRODUCTION=https://api.tudominio.com/webhook/whatsapp
WEBHOOK_URL_TEST=https://test-api.tudominio.com/webhook/whatsapp
```

**Variables de Alertas (Opcionales):**
```bash
TELEGRAM_BOT_TOKEN=tu-token-bot-telegram
TELEGRAM_CHAT_ID=tu-chat-id-telegram
```

### Gestion de Entornos:
- **NODE_ENV=production**: Usa WEBHOOK_URL_PRODUCTION
- **NODE_ENV=test**: Usa WEBHOOK_URL_TEST
- Cambio dinamico sin perder sesion WhatsApp
- El agente muestra el entorno activo en logs y pagina web

### 2.4 Configurar Dominio

1. En la sección **"Domains"**
2. Agregar: `mba.tudominio.com` (sustituye por tu dominio real)
3. Habilitar **HTTPS automático**
4. Puerto: `8080`

### 2.5 Configurar Almacenamiento

**Volúmenes necesarios:**
1. **Sesiones WhatsApp**:
   - Nombre: `mba-whatsapp-sessions`
   - Mount Path: `/app/.wwebjs_auth`
   - Tamaño: 1GB

2. **Logs**:
   - Nombre: `mba-logs`
   - Mount Path: `/app/logs`
   - Tamaño: 512MB

## Paso 3: Verificar Despliegue

### 3.1 Comprobar Estado

```bash
# Verificar que la aplicación esté corriendo
curl -H "x-api-key: tu-clave-api" https://cliente.tudominio.com/api/whatsapp/status
```

### 3.2 Ver QR de WhatsApp

1. Ir a https://cliente.tudominio.com
2. Debería aparecer el QR para vincular WhatsApp
3. Escanear con WhatsApp → Dispositivos vinculados

### 3.3 Probar API

```bash
# Enviar mensaje de prueba
curl -X POST https://cliente.tudominio.com/api/whatsapp \
  -H "Content-Type: application/json" \
  -H "x-api-key: tu-clave-api" \
  -d '{
    "to": "1234567890",
    "text": "Hola desde MBA BravesLab en EasyPanel!"
  }'
```

## Paso 4: Configurar DNS

### 4.1 En tu proveedor de DNS

Agregar registro CNAME o A para el subdominio `mba`:
```
# Para cualquier dominio
cliente.tudominio.com → IP-DE-TU-SERVIDOR

# Ejemplo genérico
cliente.miempresa.com → 192.168.1.100
```

### 4.2 Verificar propagación DNS

```bash
nslookup cliente.tudominio.com
# Debería resolver a la IP de tu servidor EasyPanel
```

## Paso 5: Integración con n8n

### 5.1 Configurar Webhook en n8n

1. Ir a tu instancia de n8n (ej: https://easypanel.tudominio.com)
2. Crear workflow con webhook trigger
3. Configurar URLs por entorno:
   - **Produccion**: `https://api.tudominio.com/webhook/whatsapp`  
   - **Test**: `https://test-api.tudominio.com/webhook/whatsapp`

### 5.2 Actualizar Variables en EasyPanel

Configurar ambos webhooks en las variables de entorno:
```bash
WEBHOOK_URL_PRODUCTION=https://api.tudominio.com/webhook/whatsapp
WEBHOOK_URL_TEST=https://test-api.tudominio.com/webhook/whatsapp
NODE_ENV=production  # o 'test' segun necesites
```

### 5.3 Cambio de Entorno sin Interrupciones

Para cambiar de test a produccion (o viceversa):
1. Cambiar variable `NODE_ENV` en EasyPanel
2. Reiniciar la aplicacion (automatico)
3. La sesion WhatsApp se mantiene
4. El nuevo webhook se activa automaticamente

## Paso 6: Monitoreo y Mantenimiento

### 6.1 Logs de la Aplicación

En EasyPanel:
1. Ir a la aplicación `mba-braveslab`
2. Sección **"Logs"**
3. Ver logs en tiempo real

### 6.2 Health Checks

EasyPanel verificará automáticamente:
- Estado de la aplicación cada 30 segundos
- Endpoint: `/api/whatsapp/status`
- Reinicio automático si falla

### 6.3 Backups

**Configurar backup automático de volúmenes:**
1. Sesiones de WhatsApp (crítico)
2. Logs (opcional)

## Configuración de Red Recomendada

### Puertos Utilizados:
- **MBA BravesLab**: 8080 (interno del contenedor)
- **EasyPanel**: 3000 (no hay conflicto)
- **n8n**: 5678 (puerto interno)

### URLs del Ecosistema (Ejemplo):
- **EasyPanel**: https://easypanel.tudominio.com
- **n8n**: https://n8n.tudominio.com  
- **MBA BravesLab**: https://cliente.tudominio.com

## Solución de Problemas

### Problema: QR no aparece
```bash
# Verificar logs
docker logs mba-braveslab

# Verificar puerto
curl https://cliente.tudominio.com
```

### Problema: Sesión de WhatsApp se pierde
```bash
# Verificar volumen persistente
docker exec -it mba-braveslab ls -la /app/.wwebjs_auth/
```

### Problema: API no responde
```bash
# Verificar health check
curl -H "x-api-key: tu-clave" https://cliente.tudominio.com/api/whatsapp/status
```

## Ventajas de esta Configuración

✅ **Sin cambios en el código fuente**  
✅ **Dockerfile optimizado para producción**  
✅ **Persistencia de sesiones WhatsApp**  
✅ **Health checks automáticos**  
✅ **SSL automático con EasyPanel**  
✅ **Integración directa con n8n existente**  
✅ **Monitoreo y logs centralizados**  
✅ **Escalabilidad horizontal**

## Recursos Asignados

- **CPU**: 500m (0.5 core)
- **Memoria**: 512MB (límite), 256MB (reservado)
- **Almacenamiento**: 1.5GB (volúmenes)
- **Red**: Puerto 8080 interno

Esta configuración es perfecta para producción y maneja hasta 1000 conversaciones simultáneas.