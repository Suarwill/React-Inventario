const express = require('express');
const router = express.Router();
const movementController = require('../controllers/movement.controller');
const envioController = require('../controllers/envio.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const { validateUser} = require('../middlewares/validation.middleware');

router.post('/add',validateUser, authenticateToken ,movementController.addMovimiento);
router.get('/search',authenticateToken, movementController.getMovimiento);
router.get('/closest', authenticateToken, movementController.getMovimientoCercano);
router.get('/last', authenticateToken, movementController.getUltimosEnvios);
router.delete('/delete/:nro',authenticateToken , movementController.deleteMovimiento);

router.post('/envio/cargar', authenticateToken, envioController.cargarMerma);

router.post('/inventario/av/add',authenticateToken,movementController.addInventarioAV);
router.get('/inventario/av/last',authenticateToken,movementController.getInventarioAV);
router.delete('/inventario/av/delete/:nro',authenticateToken,movementController.deleteInventarioAV);

module.exports = router;