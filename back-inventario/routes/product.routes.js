const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');
const { validateUser} = require('../middlewares/validation.middleware');

router.post('/add',validateUser, authenticateToken, isAdmin ,productController.addProducto);
router.get('/search',validateUser, productController.getProducto);
router.put('/:id',validateUser, authenticateToken, isAdmin, productController.updateProducto);
router.delete('/:id',validateUser, authenticateToken, isAdmin, productController.deleteProducto);

module.exports = router;