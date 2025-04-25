#!/bin/bash
docker pull suarwill/postgresql

echo "a correr el servidor PostgreSQL"

docker run --name servidor_pg -d \
  -p 5432:5432 \
  -v almacenamiento_pg:/var/lib/postgresql/data \
  suarwill/postgresql:latest
