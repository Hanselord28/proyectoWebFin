const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/dashboard', adminController.showDashboard);



router.get('/citas/editar/:id', adminController.showEditCita);


router.post('/citas/editar/:id', adminController.processEditCita);


router.post('/citas/eliminar/:id', adminController.deleteCita);




router.get('/citas/nueva', adminController.showAddCita);


router.post('/citas/buscar-paciente', adminController.buscarPacientePorRut);


router.post('/citas/nueva', adminController.processAddCita);



router.get('/pacientes/nuevo', adminController.showAddPaciente);


router.post('/pacientes/nuevo', adminController.processAddPaciente);



router.get('/profesionales/nuevo', adminController.showAddProfesional);


router.post('/profesionales/nuevo', adminController.processAddProfesional);

// Listar profesionales
router.get('/profesionales', adminController.showProfesionales);

// Mostrar formulario de edición de profesional
router.get('/profesionales/editar/:id', adminController.showEditProfesional);

// Procesar edición de profesional
router.post('/profesionales/editar/:id', adminController.processEditProfesional);

// Eliminar un profesional
router.post('/profesionales/eliminar/:id', adminController.deleteProfesional);

module.exports = router;