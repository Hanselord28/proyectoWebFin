const pool = require('../config/db'); // Tu conexión a MySQL
const bcrypt = require('bcryptjs');

// Renderiza la vista de login (GET)
exports.showLogin = (req, res) => {
    res.render('auth/login', { error: null });
};

// Procesa formulario (POST)
exports.processLogin = async (req, res) => {
    const { correo, password } = req.body;

    // 1. Verificamos qué está recibiendo Node.js desde tu formulario HTML
    console.log("► Correo recibido del formulario:", correo);
    console.log("► Contraseña recibida del formulario:", password);

    try {
        // Intentar buscar primero en la tabla usuarios (pacientes y admins)
        let user = await userModel.getUserByEmail(correo);
        let isProfesional = false;

        // Si no lo encuentra en usuarios, buscamos en la tabla profesionales
        if (!user) {
            console.log("► Usuario no encontrado en 'usuarios'. Buscando en 'profesionales'...");
            user = await profesionalModel.getProfesionalByEmail(correo);
            isProfesional = true;
        }

        // 2. Verificamos si el modelo logró encontrar al usuario en alguna tabla
        console.log("► Usuario encontrado en MySQL:", user);

        if (!user) {
            console.log("► ERROR: El usuario no existe en ninguna tabla.");
            return res.render('auth/login', { error: 'Correo o contraseña incorrectos' });
        }

        // 3. Verificamos el match de la contraseña con bcrypt
        const validPassword = await bcrypt.compare(password, user.password);
        console.log("► ¿Contraseña válida según bcrypt?:", validPassword);

        if (!validPassword) {
            console.log("► ERROR: La contraseña no coincide con el hash de la base de datos.");
            return res.render('auth/login', { error: 'Correo o contraseña incorrectos' });
        }

        // Si todo está correcto, guardamos la sesión
        req.session.isLogged = true;
        req.session.nombreUsuario = user.nombre;

        // Redirección inteligente dependiendo del rol
        if (isProfesional) {
            req.session.userId = user.id_profesional;
            req.session.rol = 'profesional';
            req.session.rut = user.rut_personal; // Guardamos el RUT del profesional
            
            console.log("► Login exitoso: Redirigiendo a Dashboard Profesional");
            return res.redirect('/profesional/dashboard');
        } else {
            req.session.userId = user.id_usuario;
            req.session.rol = user.rol;

            if (user.rol === 'admin') {
                console.log("► Login exitoso: Redirigiendo a Dashboard Admin");
                return res.redirect('/admin/dashboard');
            } else {
                console.log("► Login exitoso: Redirigiendo a Perfil de Paciente");
                return res.redirect('/paciente/perfil');
            }
        }

    } catch (error) {
        console.error("► ERROR GRAVE EN EL SERVIDOR:", error);
        res.render('auth/login', { error: 'Error en el servidor al intentar iniciar sesión' });
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