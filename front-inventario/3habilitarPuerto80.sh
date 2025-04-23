#!/bin/bash
set -e

echo "🔐 Habilitando puerto 80 en el firewall..."
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --reload

echo "✅ Firewall configurado."
