#!/bin/bash
set -e

echo "🔐 Habilitando puerto 80 en el firewall..."
sudo dnf install firewalld -y
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --reload

echo "✅ Firewall configurado."
