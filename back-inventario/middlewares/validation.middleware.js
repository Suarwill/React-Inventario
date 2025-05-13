const { body } = require('express-validator');

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

module.exports = {
  validateUser,
  validateLogin,
  validateRegister
};