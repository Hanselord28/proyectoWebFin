const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

// Muestra el formulario para agendar hora
router.get('/nueva', citaController.showNuevaCita);

// Procesa los datos y guarda la cita
router.post('/nueva', citaController.processNuevaCita);

module.exports = router;