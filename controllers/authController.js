const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const profesionalModel = require('../models/profesionalModel');
const { validateRut, cleanRut, formatRut } = require('../utils/h-rut');

exports.showLogin = (req, res) => {
    res.render('auth/login', { error: null });
};

exports.processLogin = async (req, res) => {
    const { correo, password } = req.body;

    try {
        let user = await userModel.getUserByEmail(correo);
        let isProfesional = false;

        if (!user) {
            user = await profesionalModel.getProfesionalByEmail(correo);
            isProfesional = true;
        }

        if (!user) {
            return res.render('auth/login', { error: 'Correo o contraseña incorrectos' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.render('auth/login', { error: 'Correo o contraseña incorrectos' });
        }

        req.session.isLogged = true;
        req.session.nombre = user.nombre;
        req.session.nombreUsuario = user.nombre;

        if (isProfesional) {
            req.session.userId = user.id_profesional;
            req.session.rol = 'profesional';
            req.session.rut = user.rut_personal;
            return res.redirect('/profesional/dashboard');
        } else {
            req.session.userId = user.id_usuario;
            req.session.rol = user.rol;

            if (user.rol === 'admin') {
                return res.redirect('/admin/dashboard');
            } else {
                return res.redirect('/paciente/perfil');
            }
        }
    } catch (error) {
        console.error(error);
        res.render('auth/login', { error: 'Error en el servidor al intentar iniciar sesión' });
    }
};

exports.showRegistro = (req, res) => {
    res.render('auth/registro', { error: null });
};

exports.processRegistro = async (req, res) => {

    const { nombre, apellidos, rut, correo, telefono, prevision, password } = req.body;

    if (!validateRut(rut)) {
        return res.render('auth/registro', { error: 'El RUT ingresado no es válido.' });
    }

    const formattedRut = formatRut(cleanRut(rut));

    try {
        const existingUser = await userModel.getUserByEmail(correo);

        if (existingUser) {
            return res.render('auth/registro', { error: 'Este correo electrónico ya está registrado. Intenta iniciar sesión.' });
        }

        await userModel.createUser(nombre, apellidos, formattedRut, correo, telefono, prevision, password);

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

    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).send("No se pudo cerrar la sesión.");
        }

        res.redirect('/');
    });
};