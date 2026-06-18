const pool = require('../config/db'); // Tu conexión a MySQL
const bcrypt = require('bcryptjs');

// Renderiza la vista de login (GET)
exports.showLogin = (req, res) => {
    res.render('auth/login', { error: null });
};

// Procesa formulario (POST)
exports.processLogin = async (req, res) => {
    const { correo, password } = req.body; // Capturamos los campos del body

    try {
        // Buscar al usuario en la base de datos por su correo
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        const user = rows[0];

        // Si el usuario existe y la contraseña es correcta (bcrypt.compare)
        if (user && await bcrypt.compare(password, user.password)) {
            
            // Guardamos los datos de la sesión!
            console.log("Usuario encontrado:", user);
            console.log("Rol detectado en BD:", user.rol);
            console.log("¿La contraseña coincide?:", await bcrypt.compare(password, user.password));
            //========================================
            req.session.userId = user.id_usuario;
            req.session.rol = user.rol;
            req.session.nombre = user.nombre;

            // Redirigimos dependiendo de si es "admin" o "paciente"
            if (user.rol === 'admin') {
                return res.redirect('/admin/dashboard');
            } else {
                return res.redirect('/perfil'); 
            }
        } else {
            // Falla la validación: Se vuelve a renderizar el login con el mensaje de error
            return res.render('auth/login', { error: 'Correo o contraseña incorrectos. Inténtalo de nuevo.' });
        }

    } catch (error) {
        console.error(error);
        res.render('auth/login', { error: 'Ocurrió un error en el servidor.' });
    }
};

const userModel = require('../models/userModel');

// Mostrar la vista de registro (GET)
exports.showRegistro = (req, res) => {
    res.render('auth/registro', { error: null });
};

// Procesar los datos de registro (POST)
exports.processRegistro = async (req, res) => {
    const { nombre, apellidos, correo, password } = req.body;

    try {
        //Verificar si el correo ya está registrado
        const existingUser = await userModel.getUserByEmail(correo);
        
        if (existingUser) {
            return res.render('auth/registro', { error: 'Este correo electrónico ya está registrado. Intenta iniciar sesión.' });
        }

        // Si no existe, creamos el usuario en la bd
        await userModel.createUser(nombre, apellidos, correo, password);

        
        //redirigimos al login 
        res.redirect('/auth/login');

    } catch (error) {
        console.error("Error en el registro:", error);
        res.render('auth/registro', { error: 'Ocurrió un error al crear la cuenta. Inténtalo de nuevo.' });
    }
};


exports.logout = (req, res) => {
    // Destruimos sesión
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).send("No se pudo cerrar la sesión.");
        }
        
        // Redirigimos al inicio
        res.redirect('/');
    });
};