const citaModel = require('../models/citaModel');
const userModel = require('../models/userModel'); 


exports.showNuevaCita = async (req, res) => {
    try {
        const profesionales = await citaModel.getProfesionales();
        const procedimientos = await citaModel.getProcedimientos();
        
        
        const isLogged = req.session && req.session.userId ? true : false;

        res.render('citas/nueva', { profesionales, procedimientos, isLogged, error: null, success: null });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el formulario");
    }
};


exports.processNuevaCita = async (req, res) => {
    const { id_procedimiento, id_profesional, fecha, hora, nombre_invitado, apellidos_invitado, correo_invitado } = req.body;
    let id_usuario = null;

    try {
        if (req.session && req.session.userId) {
            
            id_usuario = req.session.userId;
        } else {
            
            let existingUser = await userModel.getUserByEmail(correo_invitado);
            
            if (existingUser) {
                
                id_usuario = existingUser.id_usuario;
            } else {
                
                
                const randomPassword = Math.random().toString(36).slice(-8);
                const result = await userModel.createUser(nombre_invitado, apellidos_invitado, null, correo_invitado, null, null, randomPassword);
                id_usuario = result.insertId; 
            }
        }

        
        await citaModel.createCita(id_usuario, id_profesional, id_procedimiento, fecha, hora);

        
        const profesionales = await citaModel.getProfesionales();
        const procedimientos = await citaModel.getProcedimientos();
        const isLogged = req.session && req.session.userId ? true : false;

        res.render('citas/nueva', { profesionales, procedimientos, isLogged, error: null, success: '¡Tu hora ha sido agendada con éxito!' });

    } catch (error) {
        console.error("Error al agendar cita:", error);
        res.status(500).send("Error al procesar la solicitud");
    }
};