const express = require('express');
const router = express.Router();
const movementController = require('../controllers/movement.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const { validateUser} = require('../middlewares/validation.middleware');

router.post('/add',validateUser, authenticateToken ,movementController.addMovimiento);
router.get('/search',validateUser, movementController.getMovimiento);
router.put('/:id',validateUser, authenticateToken , movementController.updateMovimiento);
router.delete('/:id',validateUser, authenticateToken , movementController.deleteMovimiento);

module.exports = router;