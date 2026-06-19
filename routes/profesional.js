const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');


router.get('/dashboard', profesionalController.showDashboard);

module.exports = router;