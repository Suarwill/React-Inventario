#!/bin/bash
# Script para crear un usuario administrador en la base de datos PostgreSQL
curl -X POST http://localhost:3000/user/especialRegistro \
    -H "Content-Type: application/json" \
    -d '{
        "username": "admin",
        "password": "william"
    }'