#!/bin/bash

# realizando prueba del backend
curl -X GET http://localhost:3000/

# prueba de crear usuario
echo "Realizando prueba... sin /api/"
curl -X GET http://localhost:3000/user/search?username=admin \
    -H "Content-Type: application/json"

echo "Realizando prueba... con /api/"
curl -X GET http://localhost:3000/api/user/search?username=admin \
    -H "Content-Type: application/json"

echo "Realizando prueba... con /api/api/"
curl -X GET http://localhost:3000/api/api/user/search?username=admin \
    -H "Content-Type: application/json"