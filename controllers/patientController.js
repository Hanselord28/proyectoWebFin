const patientModel = require('../models/patientModel');

exports.showPerfil = async (req, res) => {

    if (!req.session || !req.session.userId) {
        return res.redirect('/auth/login');
    }

    const id_usuario = req.session.userId;

    try {

        const citasPendientes = await patientModel.getCitasPendientes(id_usuario);
        const historial = await patientModel.getHistorialClinico(id_usuario);

        res.render('paciente/perfil', {
            nombreUsuario: req.session.nombre,
            citas: citasPendientes,
            historial: historial
        });

    } catch (error) {
        console.error("Error al cargar el perfil del paciente:", error);
        res.status(500).send("Ocurrió un error al cargar tu perfil.");
    }
};

exports.cancelarCita = async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.redirect('/auth/login');
    }

    const id_usuario = req.session.userId;
    const id_cita = req.params.id;

    try {
        await patientModel.cancelCita(id_cita, id_usuario);
        res.redirect('/paciente/perfil');
    } catch (error) {
        console.error("Error al cancelar la cita:", error);
        res.status(500).send("Ocurrió un error al cancelar la cita.");
    }
};