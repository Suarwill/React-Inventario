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

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumentar límite para JSON
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Aumentar límite para formularios

// Ruta para pruebas
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando 👌');
});

// Rutas (Segun la configuracion en NGINX, hay que omitir aqui el prefijo /api)
app.use('/user', userRoutes);  // todas las rutas de usuario: /user/login, /user/register, etc.
app.use('/product', productRoutes); // todas las rutas de producto: /product/add, /product/update, etc.
app.use('/deposito', depositoRoutes); // todas las rutas de deposito: /deposito/add, /deposito/update, etc.
app.use('/movimiento', movimientoRoutes); // todas las rutas de movimiento: /movimiento/add, /movimiento/update, etc.
app.use('/conteo', conteoRoutes); // todas las rutas de conteo: /conteo/add, /conteo/update, etc.

// Middleware para manejar errores, rutas no encontradas y errores de servidor
app.use((req, res, next) => {
  res.status(404).json({ error: 'la ruta'+ req.path + ' no existe, favor verificar'});
});

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