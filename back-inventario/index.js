require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const depositoRoutes = require('./routes/deposito.routes');
const movimientoRoutes = require('./routes/movimiento.routes');
const conteoRoutes = require('./routes/conteo.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Ruta para pruebas
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando 👌');
});

// Rutas
app.use('/api/user', userRoutes);  // todas las rutas de usuario: /user/login, /user/register, etc.
app.use('/api/product', productRoutes); // todas las rutas de producto: /product/add, /product/update, etc.
app.use('/api/deposito', depositoRoutes); // todas las rutas de deposito: /deposito/add, /deposito/update, etc.
app.use('/api/movimiento', movimientoRoutes); // todas las rutas de movimiento: /movimiento/add, /movimiento/update, etc.
app.use('/api/conteo', conteoRoutes); // todas las rutas de conteo: /conteo/add, /conteo/update, etc.


app.listen(PORT, '127.0.0.1',() => {
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