// models/userModel.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs'); // Asegúrate de haber instalado bcryptjs

// Buscar usuario por correo para el Login
const getUserByEmail = async (correo) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return rows[0]; // Devuelve el usuario si existe, o undefined si no
};

// Crear un nuevo usuario (Registro)
const createUser = async (nombre, apellidos, correo, password, rol = 'paciente', rut, telefono, prevision) => {
    // Encriptamos la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // El orden de las columnas DEBE coincidir exactamente con el orden del arreglo de valores
    await pool.query(
        'INSERT INTO usuarios (nombre, apellidos, correo, password, rol, rut, telefono, prevision) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, apellidos, correo, hashedPassword, rol, rut, telefono, prevision]
    );
};

module.exports = {
    getUserByEmail,
    createUser
};



