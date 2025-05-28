const express = require('express');
const router = express.Router();
const conteoController = require('../controllers/conteo.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const { validateUser} = require('../middlewares/validation.middleware');
const limiter = require('../middlewares/limit.middleware');

router.post('/add', authenticateToken ,conteoController.addConteo);
router.get('/search/:nro',authenticateToken, limiter, conteoController.getConteos);
router.put('/:id',validateUser, authenticateToken , conteoController.updateConteo);
router.delete('/:id',validateUser, authenticateToken , conteoController.deleteConteo);

module.exports = router;