#!/bin/bash

# Variables de entorno
CONTAINER_NAME=postgres_inventario
DB_USER=servidor
DB_NAME=inventario
DB_PORT=5432
VOLUME_NAME=databaseInventario

# Solicitar la contraseña al usuario
read -sp "Introduce la contraseña para el usuario PostgreSQL ($DB_USER): " DB_PASSWORD
echo

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "Docker no está instalado. Instalando..."

    # Detectar distribución (para sistemas basados en Debian/Ubuntu)
    if [ -f /etc/debian_version ]; then
        sudo apt update
        sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
          sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt update
        sudo apt install -y docker-ce
    else
        echo "Distribución no compatible automáticamente. Instala Docker manualmente."
        exit 1
    fi
fi

# Iniciar el servicio Docker si está detenido
sudo systemctl start docker
sudo systemctl enable docker

# Descargar imagen de PostgreSQL si no existe
echo "Obteniendo imagen de PostgreSQL..."
docker pull postgres:16

# Crear volumen persistente
docker volume create $VOLUME_NAME

# Eliminar contenedor previo si existe
docker rm -f $CONTAINER_NAME 2>/dev/null

# Ejecutar contenedor PostgreSQL
docker run -d \
  --name $CONTAINER_NAME \
  -e POSTGRES_USER=$DB_USER \
  -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -e POSTGRES_DB=$DB_NAME \
  -p $DB_PORT:5432 \
  -v $VOLUME_NAME:/var/lib/postgresql/data \
  --restart=unless-stopped \
  postgres:16

echo "PostgreSQL montado y corriendo en el puerto $DB_PORT"