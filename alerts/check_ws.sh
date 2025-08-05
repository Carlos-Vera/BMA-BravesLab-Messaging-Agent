#!/bin/bash
NAME="demo"
if ! pm2 list | grep -q "$NAME"; then
  /usr/local/bin/alerta_telegram.sh "⚠️ WhatsApp $NAME está caído"
  pm2 restart "$NAME"
fi
