const citaModel = require('../models/citaModel');
const userModel = require('../models/userModel'); // Lo necesitamos para el modo invitado

// 1. Mostrar el formulario de agendamiento
exports.showNuevaCita = async (req, res) => {
    try {
        const profesionales = await citaModel.getProfesionales();
        const procedimientos = await citaModel.getProcedimientos();
        
        // Verificamos si el usuario tiene una sesión activa
        const isLogged = req.session && req.session.userId ? true : false;

        res.render('citas/nueva', { profesionales, procedimientos, isLogged, error: null, success: null });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el formulario");
    }
};

// 2. Procesar el formulario (Modo Invitado o Logueado)
exports.processNuevaCita = async (req, res) => {
    const { id_procedimiento, id_profesional, fecha, hora, nombre_invitado, apellidos_invitado, correo_invitado } = req.body;
    let id_usuario = null;

    try {
        if (req.session && req.session.userId) {
            // Usuario con sesión iniciada
            id_usuario = req.session.userId;
        } else {
            // MODO INVITADO
            let existingUser = await userModel.getUserByEmail(correo_invitado);
            
            if (existingUser) {
                // Si el correo ya estaba registrado, usamos su ID
                id_usuario = existingUser.id_usuario;
            } else {
                // Si es un correo nuevo, le creamos una cuenta "silenciosa"
                // Generamos una contraseña aleatoria temporal
                const randomPassword = Math.random().toString(36).slice(-8);
                const result = await userModel.createUser(nombre_invitado, apellidos_invitado, correo_invitado, randomPassword);
                id_usuario = result.insertId; // Capturamos el nuevo ID generado
            }
        }

        // Finalmente, creamos la cita médica
        await citaModel.createCita(id_usuario, id_profesional, id_procedimiento, fecha, hora);

        // Recargamos los datos para mostrar el mensaje de éxito
        const profesionales = await citaModel.getProfesionales();
        const procedimientos = await citaModel.getProcedimientos();
        const isLogged = req.session && req.session.userId ? true : false;

        res.render('citas/nueva', { profesionales, procedimientos, isLogged, error: null, success: '¡Tu hora ha sido agendada con éxito!' });

    } catch (error) {
        console.error("Error al agendar cita:", error);
        res.status(500).send("Error al procesar la solicitud");
    }
};