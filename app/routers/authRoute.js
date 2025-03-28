const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// [POST] localhost:3000/auth/login
router.post('/login', authController.login);

// [GET] /login - Render login page
router.get('/login', authController.renderLoginPage);

// [POST] /login - Handle login
router.post('/login', authController.login);

// [GET] /register - Render registration page
router.get('/register', authController.renderRegisterPage);

// [POST] /register - Handle registration
router.post('/register', authController.register);

// [GET] /logout - Handle logout
router.get('/logout', authController.logout);

// [GET] /user - Get current user
router.get('/user', authController.getCurrentUser);

module.exports = router;