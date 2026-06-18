const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Muestra el formulario cuando entran a /auth/login
router.get('/login', authController.showLogin);

// Procesa el formulario cuando hacen clic en "Ingresar"
router.post('/login', authController.processLogin);

// Ruta GET: Muestra la pantalla de registro al usuario
router.get('/registro', authController.showRegistro);

// Ruta POST: Procesa el formulario de registro
router.post('/registro', authController.processRegistro);

//ruta para cerrar sesión
router.get('/logout', authController.logout);


module.exports = router;