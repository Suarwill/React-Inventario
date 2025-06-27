const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');
const { validateUser, validateLogin, validateRegister } = require('../middlewares/validation.middleware'); // Importar validaciones

// Rutas
router.post('/login', validateLogin, userController.loginUser);
router.post('/especialRegistro',userController.registroEspecialUserController);
router.post('/register', validateRegister,authenticateToken, isAdmin, userController.registerUser);
router.get('/search', validateUser, authenticateToken, isAdmin, userController.buscarUsuario);
router.delete('/:username', validateUser, authenticateToken, isAdmin, userController.eliminarUsuario);
router.put('/:username', validateUser, authenticateToken, isAdmin, userController.updateUser);

module.exports = router;