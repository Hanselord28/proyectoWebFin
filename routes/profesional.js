const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');

// Ruta GET: Muestra el panel y procesa las búsquedas de RUT
router.get('/dashboard', profesionalController.showDashboard);

module.exports = router;