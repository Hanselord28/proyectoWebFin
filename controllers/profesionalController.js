const profesionalModel = require('../models/profesionalModel');
const { validateRut, cleanRut, formatRut } = require('../utils/h-rut');

exports.showDashboard = async (req, res) => {

    if (!req.session || req.session.rol !== 'profesional') {
        return res.redirect('/');
    }

    const id_profesional = req.session.userId;
    const rutBusqueda = req.query.rut; 

    try {
        const citas = await profesionalModel.getCitasByProfesional(id_profesional);

        let pacienteEncontrado = null;
        let historialPaciente = [];

        if (rutBusqueda) {
            const formattedRut = formatRut(cleanRut(rutBusqueda));
            pacienteEncontrado = await profesionalModel.getPacienteByRut(formattedRut);
            if (pacienteEncontrado) {
                historialPaciente = await profesionalModel.getHistorialPaciente(pacienteEncontrado.id_usuario);
            }
        }

        res.render('profesional/dashboard', {
            nombreDoc: req.session.nombre,
            citas: citas,
            rutBuscado: rutBusqueda,
            paciente: pacienteEncontrado,
            historial: historialPaciente
        });

    } catch (error) {
        console.error("Error en el dashboard del profesional:", error);
        res.status(500).send("Error interno del servidor");
    }
};

exports.showRegistroConsulta = async (req, res) => {
    if (!req.session || req.session.rol !== 'profesional') {
        return res.redirect('/');
    }

    try {
        const id_cita = req.params.id_cita;
        const id_profesional = req.session.userId;

        const cita = await profesionalModel.getCitaByIdForProfesional(id_cita, id_profesional);
        if (!cita) {
            return res.redirect('/profesional/dashboard');
        }

        res.render('profesional/registro_consulta', {
            nombreDoc: req.session.nombre,
            cita: cita
        });

    } catch (error) {
        console.error("Error al cargar formulario de registro:", error);
        res.status(500).send("Error interno del servidor");
    }
};

exports.processRegistroConsulta = async (req, res) => {
    if (!req.session || req.session.rol !== 'profesional') {
        return res.redirect('/');
    }

    try {
        const id_cita = req.params.id_cita;
        const id_profesional = req.session.userId;
        const { diagnostico, tratamiento_realizado, presupuesto, observaciones } = req.body;

        const cita = await profesionalModel.getCitaByIdForProfesional(id_cita, id_profesional);
        if (!cita) {
            return res.redirect('/profesional/dashboard');
        }

        await profesionalModel.addHistorialClinico(
            cita.id_usuario, 
            id_cita, 
            diagnostico, 
            tratamiento_realizado, 
            presupuesto || 0, 
            id_profesional, 
            observaciones || ''
        );

        // Actualizar el estado de la cita a completada
        await profesionalModel.updateEstadoCita(id_cita, 'completada');

        res.redirect('/profesional/dashboard');

    } catch (error) {
        console.error("Error al guardar el registro de la consulta:", error);
        res.status(500).send("Error interno del servidor al guardar el registro");
    }
};