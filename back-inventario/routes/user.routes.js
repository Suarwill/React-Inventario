const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authenticateToken = require('../middlewares/auth.middleware'); // Importar middleware de autenticación
const isAdmin = require('../middlewares/admin.middleware'); // Importar middleware de autorización admin

// Middleware de validación
const validateUser = [
  body('username').trim().escape().notEmpty().withMessage('El usuario es requerido')
];

const validateLogin = [
  body('username').trim().escape().notEmpty().withMessage('El usuario es requerido'),
  body('password').trim().escape().notEmpty().withMessage('La contraseña es requerida')
];

const validateRegister = [
  body('username').trim().escape().notEmpty().withMessage('El usuario es requerido'),
  body('password')
    .trim()
    .escape()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Rutas
router.post('/login', validateLogin, userController.loginUser);
router.post('/register', validateRegister,isAdmin, userController.registerUser);
router.get('/search', validateUser,authenticateToken, isAdmin, userController.searchUsers);
router.delete('/:username', validateUser,authenticateToken, isAdmin, userController.deleteUser);
router.put('/:username', validateUser,authenticateToken, isAdmin,userController.updateUser);


module.exports = router;