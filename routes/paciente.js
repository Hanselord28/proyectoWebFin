const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');


router.get('/perfil', patientController.showPerfil);

module.exports = router;