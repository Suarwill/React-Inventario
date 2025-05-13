const express = require('express');
const router = express.Router();
const conteoController = require('../controllers/conteo.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const { validateUser} = require('../middlewares/validation.middleware');

router.post('/add',validateUser, authenticateToken ,conteoController.addConteo);
router.get('/search',validateUser, conteoController.getConteo);
router.put('/:id',validateUser, authenticateToken , conteoController.updateConteo);
router.delete('/:id',validateUser, authenticateToken , conteoController.deleteConteo);

module.exports = router;