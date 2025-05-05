const express = require('express');
const router = express.Router();
const sanitizeInput = require('../middlewares/sanitize.middleware');
const userController = require('../controllers/user.controller');


router.post('/register', sanitizeInput, userController.registerUser);
router.post('/login', sanitizeInput, userController.loginUser);
router.get('/search', sanitizeInput, userController.searchUsers);
router.delete('/:username', sanitizeInput, userController.deleteUser);

module.exports = router;