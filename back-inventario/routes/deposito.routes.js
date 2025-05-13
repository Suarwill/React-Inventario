const express = require('express');
const router = express.Router();
const depositoController = require('../controllers/deposito.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const { validateUser} = require('../middlewares/validation.middleware');

router.post('/add',validateUser, authenticateToken ,depositoController.addDeposito);
router.get('/search',validateUser, depositoController.getDeposito);
router.put('/:id',validateUser, authenticateToken , depositoController.updateDeposito);
router.delete('/:id',validateUser, authenticateToken , depositoController.deleteDeposito);

module.exports = router;