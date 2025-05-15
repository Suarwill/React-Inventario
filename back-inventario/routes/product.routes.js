const express = require('express');
const multer = require('multer');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');
const { validateUser} = require('../middlewares/validation.middleware');

const upload = multer({ dest: 'uploads/' }); // Configuración de multer para archivos temporales

router.post('/add',validateUser, authenticateToken, isAdmin ,productController.addProducto);
router.get('/search',authenticateToken, productController.getProducto);
router.put('/:id',validateUser, authenticateToken, isAdmin, productController.updateProducto);
router.delete('/:id',validateUser, authenticateToken, isAdmin, productController.deleteProducto);
router.post('/upload-csv', upload.single('file'), productController.uploadCsv);
router.put('/edit/:codigo', productController.editProduct);

module.exports = router;