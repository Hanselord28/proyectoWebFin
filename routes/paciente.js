const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Ruta GET: Muestra el perfil del paciente
router.get('/perfil', patientController.showPerfil);

module.exports = router;