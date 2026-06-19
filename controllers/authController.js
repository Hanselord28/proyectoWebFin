const pool = require('../config/db'); // Tu conexión a MySQL
const bcrypt = require('bcryptjs');

// Renderiza la vista de login (GET)
exports.showLogin = (req, res) => {
    res.render('auth/login', { error: null });
};

// Procesa formulario (POST)
exports.processLogin = async (req, res) => {
    const { correo, password } = req.body;

    try {
        //buscar si es un Paciente o Administrador
        let user = await userModel.getUserByEmail(correo);
        let isProfesional = false;

        //comprobamos que si no es paciente o admin, sea un profesional
        if (!user) {
            const profesionalModel = require('../models/profesionalModel');
            user = await profesionalModel.getProfesionalByEmail(correo);
            isProfesional = true; // Marcamos que el usuario encontrado es dentista
        }

        // verificamos la contraseña
        if (user && await bcrypt.compare(password, user.password)) {
            // Asignamos los datos de sesión (ID y Nombre)
            req.session.userId = isProfesional ? user.id_profesional : user.id_usuario;
            req.session.nombre = user.nombre;
            
            //Asignamos el rol 
            req.session.rol = isProfesional ? 'profesional' : user.rol;

            //Redirigimos segun el rol
            if (req.session.rol === 'admin') {
                return res.redirect('/admin/dashboard');
            } else if (req.session.rol === 'profesional') {
                return res.redirect('/profesional/dashboard');
            } else {
                return res.redirect('/paciente/perfil'); 
            }
        } else {
            return res.render('auth/login', { error: 'Correo o contraseña incorrectos. Inténtalo de nuevo.' });
        }
    } catch (error) {
        console.error("Error en el login:", error);
        res.render('auth/login', { error: 'Ocurrió un error en el servidor.' });
    }
};

const userModel = require('../models/userModel');

//Mostrar la vista de registro (GET)
exports.showRegistro = (req, res) => {
    res.render('auth/registro', { error: null });
};

// Procesar los datos de registro (POST)
exports.processRegistro = async (req, res) => {
    //Extraemos los campos del formulario
    const { nombre, apellidos, rut, correo, telefono, prevision, password } = req.body;

    try {
        const existingUser = await userModel.getUserByEmail(correo);
        
        if (existingUser) {
            return res.render('auth/registro', { error: 'Este correo electrónico ya está registrado. Intenta iniciar sesión.' });
        }

        //Pasamos los nuevos datos al modelo en el orden correcto
        await userModel.createUser(nombre, apellidos, rut, correo, telefono, prevision, password);

        // Redirigimos al login
        res.redirect('/auth/login');

    } catch (error) {
        console.error("Error en el registro:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.render('auth/registro', { error: 'Este RUT o Correo ya se encuentra registrado.' });
        }
        res.render('auth/registro', { error: 'Ocurrió un error al crear la cuenta. Inténtalo de nuevo.' });
    }
};


exports.logout = (req, res) => {
    // Destruimos sesion
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).send("No se pudo cerrar la sesión.");
        }
        
        // Redirigimos al inicio
        res.redirect('/');
    });
};