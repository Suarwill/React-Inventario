#!bash
echo "actualizando el backend."
git pull origin main

echo "📦 Se procede a eliminar el backend y a crear uno nuevo..."
# Reiniciando PostgreSQL
sudo systemctl restart postgresql

# Eliminando el backend
pm2 delete react-backend

# Creando el backend
pm2 start index.js --name react-backend --env production
pm2 save

curl http://localhost:3000

echo "✅ Todo listo. Backend corriendo."