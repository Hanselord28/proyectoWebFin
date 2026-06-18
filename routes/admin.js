const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Ruta principal del panel de administrador
router.get('/dashboard', adminController.showDashboard);

module.exports = router;