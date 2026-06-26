const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');

router.get('/dashboard', profesionalController.showDashboard);

router.get('/consulta/:id_cita', profesionalController.showRegistroConsulta);

router.post('/consulta/:id_cita', profesionalController.processRegistroConsulta);

module.exports = router;