# Guía de Instalación MBA - Para Usuarios Básicos

## ¿Qué versión elegir?

MBA BravesLab ofrece dos opciones de instalación. Elige la que mejor se adapte a tu perfil:

### MBA EasyPanel (Recomendada para la mayoría)

**Ideal si:**
- Quieres una instalación rápida y automatizada
- No tienes experiencia avanzada con servidores
- Priorizas simplicidad sobre control técnico
- Instalas para clientes no técnicos
- Quieres mantenimiento automatizado

**Tiempo:** 10-15 minutos | **Conocimientos:** Básicos

### MBA Shell (Para desarrolladores)

**Ideal si:**
- Tienes experiencia con Linux y Node.js
- Necesitas máxima customización
- Quieres mínimo uso de recursos del servidor
- Disfrutas configurar sistemas manualmente
- Controlas completamente la infraestructura

**Tiempo:** 30-60 minutos | **Conocimientos:** Avanzados

### Comparativa Rápida

| Aspecto | EasyPanel | Shell |
|---------|-----------|-------|
| **Dificultad** | Fácil | Difícil |
| **Tiempo instalación** | 10-15 min | 30-60 min |
| **Mantenimiento** | Automático | Manual |
| **Uso servidor** | +15% recursos | Mínimo |
| **Actualizaciones** | Automáticas | Manuales |
| **SSL/HTTPS** | Automático | Manual |
| **Ideal para** | Empresas, consultores | Desarrolladores |

[Ver comparativa completa](COMPARATIVA_MBA_SHELL_vs_EP.md)

---

## Instalación MBA EasyPanel

Esta guía es para la versión **MBA EasyPanel**. Si eliges MBA Shell, [ve a la documentación técnica](README.md#instalación-rápida).

## Qué vas a conseguir

Un agente de WhatsApp profesional que:
- Se conecta a tu número de WhatsApp Business mediante QR
- Permite enviar mensajes automáticamente vía API
- Se integra con sistemas de automatización como N8N o Make mediante Webhook
- Funciona 24/7 sin necesidad de tener el teléfono conectado

## Requisitos Previos

### Lo que NECESITAS tener:
- Un servidor con EasyPanel instalado
- Un dominio propio (ej: miempresa.com)
- Acceso al panel de control de tu dominio
- WhatsApp Business en tu teléfono

### Conocimientos necesarios:
- Nivel: Básico-Intermedio
- Saber acceder al panel de control de tu dominio
- Entender conceptos básicos de DNS
- Poder seguir instrucciones paso a paso

## Tiempo estimado: 10-15 minutos

---

## Paso 1: Configurar DNS (3 minutos)

### Qué hacer:
Ve al panel de control de tu dominio (Hostinger, GoDaddy, Ionos, etc.) y agrega un registro:

```
Tipo: A
Nombre: mba
Valor: [IP de tu servidor EasyPanel]
TTL: Automático / Valor por defecto
```

### Ejemplo práctico:
Si tu dominio es `miempresa.com` y tu servidor EasyPanel está en `192.168.1.100`:

```
Tipo: A
Nombre: mba
Valor: 192.168.1.100
```

Esto creará: `mba.miempresa.com`

### Cómo verificar si funciona:
Espera 5-10 minutos y prueba abrir: `http://mba.tudominio.com`
(Debe dar error 404 o similar, en algunos casos el navegador no permite acceder al sitio por no poseer un certificado SSL, en este caso, añade la excepción u omite el mensaje, depende del navegador, pero NO debe decir "sitio no encontrado")

---

## Paso 2: Instalar en EasyPanel (5 minutos)

### Acceder a EasyPanel:
1. Ve a tu panel EasyPanel (ej: `https://panel.tudominio.com`)
2. Inicia sesión con tu usuario administrador

### Crear la aplicación:
1. Haz clic en "New Project" o "Nuevo Proyecto" coloca un nombre
2. Selecciona "Servicios", luego "Aplicación", coloca un nombre a tu App ej: mba_braveslab 
3. Importar desde GitHub:
  - **Propietario:** Carlos Vera
  - **Repositorio**
   ```
   https://raw.githubusercontent.com/Carlos-Vera/waw-braves-js/main/easypanel-template.json
   ```

### Completar el formulario:

**Dominio Base:**
- Pon tu dominio sin subdominios: `miempresa.com`
- NO pongas `www` ni `https://`
- Se creará automáticamente: `mba.miempresa.com`

**Entorno de Despliegue:**
- **Producción**: Para uso real con clientes
- **Test**: Para pruebas y desarrollo
- En las variables introduce test o production y la app determina qué webhook usar automáticamente

**Nombre del Agente:**
- Pon algo descriptivo como: `mi-empresa-bot`
- Solo letras, números y guiones
- Ejemplo: `restaurante-los-alamos`

**Clave de Seguridad (API Key):**
- Click en "Generar Automáticamente" 
- O crea una contraseña de mínimo 12 caracteres
- GUÁRDALA en un lugar seguro, la necesitarás después

**Webhooks (Ambos Opcionales):**
- **PRODUCCIÓN**: URL de tu sistema en vivo
- **TEST**: URL de tu sistema de pruebas
- Si no sabes qué son, déjalos vacíos
- El agente usa el webhook correcto según el entorno

### Configuración automática:
- **Dominio**: Se configurará como `mba.tudominio.com`
- **SSL**: EasyPanel activará HTTPS automáticamente
- **Puerto**: 8080 (interno del contenedor)

---

## Paso 3: Desplegar y Esperar (3 minutos)

### Iniciar despliegue:
1. Click en "Deploy" o "Desplegar"
2. Espera 3-5 minutos mientras se instala
3. Verás logs de instalación en pantalla

### Verificar instalación:
1. Ve a: `https://mba.tudominio.com`
2. Deberías ver una pantalla con un código QR
3. Si sale error, espera 2-3 minutos más y recarga

---

## Paso 4: Conectar WhatsApp (2 minutos)

### En tu teléfono:
1. Abre WhatsApp Business
2. Ve a: **Configuración → Dispositivos Vinculados**
3. Toca **"Vincular un dispositivo"**
4. Te pedirá tu huella/PIN para confirmar

### En tu computadora:
1. Ve a: `https://mba.tudominio.com`
2. Verás un código QR grande
3. Escanea el QR con la cámara de WhatsApp
4. En 10-15 segundos debería decir "Conectado"

### Señales de éxito:
- En el teléfono: Aparece "EasyPanel MBA" en dispositivos vinculados
- En la web: El QR desaparece y dice "WhatsApp conectado y listo"
- Recibes un mensaje de confirmación en WhatsApp

---

## Paso 5: Probar que Funciona (3 minutos)

### Probar el estado:
Abre esta URL en tu navegador:
```
https://mba.tudominio.com/api/whatsapp/status
```

Te pedirá usuario y contraseña:
- **Usuario:** (vacío)
- **Contraseña:** Tu API Key del Paso 2

Deberías ver algo como:
```json
{
  "clientExists": true,
  "clientReady": true,
  "isConnected": true
}
```

### Enviar mensaje de prueba:
Usa una herramienta como Postman o curl:

```bash
curl -X POST https://mba.tudominio.com/api/whatsapp \
  -H "Content-Type: application/json" \
  -H "x-api-key: TU-API-KEY-AQUI" \
  -d '{
    "to": "1234567890",
    "text": "Hola, este es un mensaje de prueba"
  }'
```

Reemplaza:
- `TU-API-KEY-AQUI` con tu clave del Paso 2
- `1234567890` con un número de teléfono real (incluye código de país)

---

## Problemas Comunes y Soluciones

### "No puedo acceder a mba.midominio.com"
**Causa:** DNS no está configurado correctamente
**Solución:** 
1. Verifica el registro A en tu proveedor de dominio
2. Espera 1-2 horas para propagación DNS
3. Prueba desde otra red wifi/datos móviles

### "Sale un código QR, pero no se conecta"
**Causa:** Firewall o problema de red
**Solución:**
1. Verifica que el puerto 8080 esté abierto en tu servidor
2. Prueba escanear desde otra red wifi
3. Reinicia la aplicación en EasyPanel

### "API da error 401 Unauthorized" 
**Causa:** API Key incorrecta
**Solución:**
1. Comprueba que estás usando la clave correcta
2. Asegúrate de enviar el header: `x-api-key: TU-CLAVE`
3. No uses espacios al principio o final de la clave

### "Mensajes no llegan"
**Causa:** Número de teléfono incorrecto
**Solución:**
1. Incluye código de país: `573001234567` (Colombia)
2. No uses símbolos como +, -, espacios
3. Verifica que el número tenga WhatsApp activo

### "La aplicación no inicia en EasyPanel"
**Causa:** Configuración incorrecta o falta de recursos
**Solución:**
1. Verifica que el servidor tenga al menos 512MB RAM libres
2. Revisa los logs en EasyPanel para errores específicos
3. Asegúrate de que el dominio base no incluya `https://` o `www`

---

## Siguiente Paso: Integraciones

Una vez funcionando, puedes:

### Conectar con n8n:
1. Instala n8n en EasyPanel
2. Crea un workflow con webhook
3. Configura la WEBHOOK_URL en tu agente MBA

### Conectar con Make.com:
1. Crea una cuenta en Make.com
2. Configura un webhook receiver
3. Usa la URL del webhook en MBA

### Conectar con tu sistema:
1. Usa la API REST para enviar mensajes
2. Recibe mensajes vía webhook
3. Integra con tu CRM o sistema existente

---

## Ventajas MBA EasyPanel vs MBA Shell

### Lo que GANAS con EasyPanel:
- **SSL automático**: HTTPS configurado automáticamente
- **Gestión de entornos**: Cambio fácil entre producción y test
- **Webhooks duales**: URLs separadas para cada entorno
- **Actualizaciones automáticas**: Desde GitHub sin tocar nada
- **Backup automático**: Sesiones WhatsApp respaldadas
- **Monitoring integrado**: Logs y métricas en dashboard
- **Health checks**: Reinicio automático si algo falla
- **Zero-downtime deploy**: Actualizaciones sin interrupción

### Lo que PIERDES vs Shell:
- **Control granular**: Menos opciones de customización
- **Recursos**: +15% a 20% overhead por Docker
- **Flexibilidad**: Estructura de archivos fija

### Cuándo considerar migrar a Shell:
- Necesitas modificaciones profundas del código
- El overhead de recursos es crítico
- Tienes equipo técnico dedicado
- Requieres integraciones muy específicas

---

## Mantenimiento MBA EasyPanel

### Automático (no requieres hacer nada):
- **Actualizaciones de seguridad**: Sistema base actualizado
- **SSL**: Renovación automática de certificados
- **Backups**: Volúmenes respaldados automáticamente
- **Health checks**: Reinicio si la app falla
- **Logs**: Rotación y limpieza automática

### Manual (ocasional):
- **Actualizar configuración**: Cambiar variables de entorno
- **Monitorear recursos**: Verificar uso de CPU/RAM
- **Revisar logs**: Solo si hay problemas

### Tiempo de mantenimiento mensual: 15-30 minutos

---

## Escalando tu Operación

### Un cliente adicional:
1. Repetir proceso completo (10-15 minutos)
2. Usar subdominio diferente: `mba.cliente2.com`
3. Configurar API Key diferente
4. Aislamiento completo entre clientes

### Múltiples clientes en el mismo servidor:
- **Capacidad típica**: 10-15 clientes por servidor
- **Recursos por cliente**: 256-512MB RAM
- **Monitoring**: Panel EasyPanel unificado
- **Backup**: Volúmenes independientes

### Cuándo necesitas más servidores:
- Más de 15 clientes activos
- Uso de RAM > 80% sostenido
- Latencia > 500ms en API calls
- Requerimientos de compliance/aislamiento

---

## Soporte y Recursos

### Si necesitas ayuda:
- **Email:** hello@braveslab.com
- **Documentación técnica:** [README.md](README.md)
- **Comparativa versiones:** [COMPARATIVA_MBA_SHELL_vs_EP.md](COMPARATIVA_MBA_SHELL_vs_EP.md)
- **Comunidad:** https://github.com/Carlos-Vera/waw-braves-js/discussions

### Para uso comercial:
Esta versión es para uso no comercial. Si necesitas licencia comercial:
- **Contacta:** hello@braveslab.com
- **Empresa:** BRAVES LAB LLC

### Recursos adicionales:
- **Video tutoriales**: Próximamente en YouTube
- **Documentación API**: En el README principal
- **Templates n8n**: En el repositorio GitHub
- **Integraciones Make.com**: Guías en documentación

---

**¡Listo! Tu agente MBA EasyPanel debería estar funcionando en 10-15 minutos siguiendo esta guía.**

**Siguiente paso:** Integra con tu sistema de IA favorito y automatiza tus conversaciones de WhatsApp.

---

**Guía desarrollada por BRAVES LAB LLC**  
**Soporte:** hello@braveslab.com | **Web:** braveslab.com