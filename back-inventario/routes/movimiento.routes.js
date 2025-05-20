const express = require('express');
const router = express.Router();
const movementController = require('../controllers/movement.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const { validateUser} = require('../middlewares/validation.middleware');

router.post('/add',validateUser, authenticateToken ,movementController.addMovimiento);
router.get('/search',authenticateToken, movementController.getMovimiento);
router.get('/closest', authenticateToken, movementController.getMovimientoCercano);
router.get('/last', authenticateToken, movementController.getUltimosEnvios);
router.put('/:id',validateUser, authenticateToken , movementController.updateMovimiento);
router.delete('/delete/:id',authenticateToken , movementController.deleteMovimiento);

module.exports = router;