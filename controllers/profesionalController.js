const profesionalModel = require('../models/profesionalModel');

exports.showDashboard = async (req, res) => {
    // Seguridad: Solo los profesionales pueden entrar
    if (!req.session || req.session.rol !== 'profesional') {
        return res.redirect('/');
    }

    const id_profesional = req.session.userId;
    const rutBusqueda = req.query.rut; // Atrapamos si el doctor buscó un RUT

    try {
        const citas = await profesionalModel.getCitasByProfesional(id_profesional);
        
        let pacienteEncontrado = null;
        let historialPaciente = [];

        // Si el doctor ingresó un RUT en el buscador, extraemos el historial
        if (rutBusqueda) {
            pacienteEncontrado = await profesionalModel.getPacienteByRut(rutBusqueda);
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