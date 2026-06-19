const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Ruta principal del panel de administrador
router.get('/dashboard', adminController.showDashboard);


// Mostrar el formulario de edición de una cita
router.get('/citas/editar/:id', adminController.showEditCita);

// Procesar los datos enviados desde el formulario de edición
router.post('/citas/editar/:id', adminController.processEditCita);

// Eliminar una cita (Usamos GET porque el botón en la vista de la tabla es un simple enlace <a>)
router.post('/citas/eliminar/:id', adminController.deleteCita);



// Mostrar la vista de agendamiento
router.get('/citas/nueva', adminController.showAddCita);

// Ruta tipo API para buscar al paciente por Fetch
router.post('/citas/buscar-paciente', adminController.buscarPacientePorRut);

// Procesar y guardar la nueva cita
router.post('/citas/nueva', adminController.processAddCita);


// Mostrar vista de nuevo paciente
router.get('/pacientes/nuevo', adminController.showAddPaciente);

// Procesar formulario de nuevo paciente
router.post('/pacientes/nuevo', adminController.processAddPaciente);


// Mostrar vista de nuevo profesional
router.get('/profesionales/nuevo', adminController.showAddProfesional);

// Procesar formulario de nuevo profesional
router.post('/profesionales/nuevo', adminController.processAddProfesional);

module.exports = router;