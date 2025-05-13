#!/bin/bash

# prueba de crear usuario
echo "Realizando prueba de login de usuario..."
curl -X POST http://localhost:3000/user/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin", "password":"1234"}'

# prueba de busqueda
echo "Realizando prueba de búsqueda de usuario..."
curl -X GET http://localhost:3000/user/search?username=admin \
    -H "Content-Type: application/json"