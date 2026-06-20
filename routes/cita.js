const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');


router.get('/nueva', citaController.showNuevaCita);


router.post('/nueva', citaController.processNuevaCita);

module.exports = router;