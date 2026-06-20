const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.get('/login', authController.showLogin);


router.post('/login', authController.processLogin);


router.get('/registro', authController.showRegistro);


router.post('/registro', authController.processRegistro);


router.get('/logout', authController.logout);


module.exports = router;