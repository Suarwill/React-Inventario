require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authenticateToken = require('./middlewares/auth.middleware');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Ruta para pruebas
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando 👌');
});

// Rutas
app.use('/user', userRoutes);  // todas las rutas de usuario: /user/login, /user/register, etc.

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  /*
  console.log('Database connection details:');
  console.log(`  Host: ${process.env.DB_HOST}`);
  console.log(`  Port: ${process.env.DB_PORT}`);
  console.log(`  User: ${process.env.DB_USER}`);
  console.log(`  Database: ${process.env.DB_NAME}`);
  console.log(`  Password Used: ${process.env.PGPASSWORD || process.env.DB_PASSWORD ? 'Yes (from env)' : 'No'}`); // Check common env vars
  */
  });