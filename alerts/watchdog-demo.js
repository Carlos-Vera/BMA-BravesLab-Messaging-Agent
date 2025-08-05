// watchdog-demo.js
const fs = require('fs');
const { exec } = require('child_process');
const path = '/opt/ws-clientes/demo/.wwebjs_auth/session-demo/DevToolsActivePort';
const ALERT_SCRIPT = '/opt/ws-clientes/demo/alerts/check_ws.sh';

fs.access(path, fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`[watchdog-demo] ❌ Sesión inactiva. Reiniciando...`);

    // Reinicia PM2
    exec('pm2 restart demo', (err, stdout, stderr) => {
      if (err) return console.error(`[watchdog-demo] ❗ Error reiniciando PM2: ${stderr}`);

      console.log(`[watchdog-demo] ✅ demo reiniciado correctamente.`);

      // Ejecutar alerta
      exec(`bash ${ALERT_SCRIPT}`, (err, stdout, stderr) => {
        if (err) return console.error(`[watchdog-demo] ⚠️ Error enviando alerta: ${stderr}`);
        console.log(`[watchdog-demo] 📢 Alerta enviada.`);
      });
    });
  } else {
    console.log(`[watchdog-demo] ✅ Sesión activa.`);
  }
});
