const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Rutas
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.get('/search', userController.searchUsers);
router.delete('/:username', userController.deleteUser);

module.exports = router;