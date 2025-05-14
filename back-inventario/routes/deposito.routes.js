const express = require('express');
const router = express.Router();
const depositoController = require('../controllers/deposito.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.post('/add',authenticateToken ,depositoController.addDeposito);
router.get('/search', authenticateToken ,depositoController.getDeposito);
router.put('/:id', authenticateToken , depositoController.updateDeposito);
router.delete('/:id', authenticateToken , depositoController.deleteDeposito);

module.exports = router;