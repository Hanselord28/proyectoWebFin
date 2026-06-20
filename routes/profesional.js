const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');


router.get('/dashboard', profesionalController.showDashboard);

// Ruta GET: Mostrar formulario para registrar consulta (historial clínico)
router.get('/consulta/:id_cita', profesionalController.showRegistroConsulta);

// Ruta POST: Procesar y guardar el registro de la consulta
router.post('/consulta/:id_cita', profesionalController.processRegistroConsulta);

module.exports = router;