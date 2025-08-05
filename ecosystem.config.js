// Configuración PM2 para BravesLab Messaging Agent (BMA)
// PM2 Configuration for BravesLab Messaging Agent (BMA)

module.exports = {
  apps: [
    {
      // Instancia de PRODUCCIÓN / PRODUCTION instance
      name: 'bma-production',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/production-error.log',
      out_file: './logs/production-out.log',
      log_file: './logs/production-combined.log',
      time: true
    },
    {
      // Instancia de TEST / TEST instance
      name: 'bma-test',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'test',
        PORT: 3001
      },
      error_file: './logs/test-error.log',
      out_file: './logs/test-out.log',
      log_file: './logs/test-combined.log',
      time: true
    }
  ],

  // Configuración de despliegue (opcional) / Deploy configuration (optional)
  deploy: {
    production: {
      user: 'node',
      host: 'tu-servidor.com',
      ref: 'origin/main',
      repo: 'git@github.com:Carlos-Vera/waw-braves-js.git',
      path: '/var/www/bma-production',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};