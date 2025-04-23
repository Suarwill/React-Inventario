#!/bin/bash

sudo npm install -g pm2
pm2 serve build 80 --name react-inventario
pm2 startup
pm2 save

# Habilitar firewall
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --reload

echo "Finalizado el habilitar WEB"