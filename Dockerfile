# Multi-stage build para optimizar imagen de producción
FROM node:18-alpine AS builder

# Información del mantenedor
LABEL maintainer="carlos@braveslab.com"
LABEL description="BravesLab Messaging Agent (MBA) - WhatsApp Web.js Agent"
LABEL version="1.1.1"

# Instalar dependencias del sistema necesarias para Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init

# Configurar Puppeteer para usar Chromium del sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Etapa de producción
FROM node:18-alpine AS production

# Instalar dependencias del sistema para producción
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init

# Configurar Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mba -u 1001 -G nodejs

# Crear directorio de trabajo y establecer permisos
WORKDIR /app
RUN chown -R mba:nodejs /app

# Cambiar a usuario no-root
USER mba

# Copiar dependencias desde el builder
COPY --from=builder --chown=mba:nodejs /app/node_modules ./node_modules

# Copiar código fuente
COPY --chown=mba:nodejs . .

# Crear directorios necesarios con permisos correctos
RUN mkdir -p .wwebjs_auth logs alerts && \
    chmod 755 .wwebjs_auth logs alerts

# Variables de entorno por defecto
ENV NODE_ENV=production \
    PORT=8080 \
    CLIENT_ID=mba-easypanel \
    API_KEY=change-this-secure-key

# Exponer puerto de la aplicación
EXPOSE 8080

# Health check para EasyPanel
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/api/whatsapp/status', {headers:{'x-api-key':process.env.API_KEY}}, (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Usar dumb-init para manejar señales correctamente
ENTRYPOINT ["dumb-init", "--"]

# Comando de inicio
CMD ["node", "index.js"]