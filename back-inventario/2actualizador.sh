#!/bin/bash
echo "Forzando git pull..."
git fetch --all
git reset --hard origin/main

echo "actualizando el backend."
git pull origin main

echo "📦 Se procede a eliminar el backend y a crear uno nuevo..."
sudo systemctl restart postgresql

pm2 delete react-backend

# Iniciar el backend sin autorestart
pm2 start index.js --name react-backend --env production

pm2 save

sudo systemctl restart nginx

curl http://localhost:3000