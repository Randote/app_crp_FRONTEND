#!/bin/bash
cd /home/dev-di/app_crp/frontend

while true; do
  inotifywait -r -e modify,create,delete,move src/ --exclude '\.git'
  echo "Cambio detectado, esperando 3s por si hay más..."
  sleep 3
  while inotifywait -r -t 1 -e modify,create,delete,move src/ --exclude '\.git' 2>/dev/null; do :; done

  echo "Compilando..."
  /home/dev-di/.local/share/pnpm/bin/pnpm run build && sudo systemctl restart app_crp_frontend && echo "Deploy OK $(date)"
done
