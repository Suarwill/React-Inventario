#!/bin/bash
echo "Descargando Contenedor personalizado de PostgreSQL... "
docker pull suarwill/postgresql

echo "Configurando Puerto 5432 para PostgreSQL... "
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --reload

echo "Comenzando el servidor PostgreSQL..."
docker run --name servidor_pg -d \
  --network inventario-red \
  -e POSTGRES_USER=servidor \
  -e POSTGRES_PASSWORD=ServerSQL \
  -e POSTGRES_DB=inventario \
  -p 5432:5432 \
  -v almacenamiento_pg:/var/lib/postgresql/data \
  suarwill/postgresql:latest
