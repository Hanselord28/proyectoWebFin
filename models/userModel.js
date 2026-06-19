
const pool = require('../config/db');
const bcrypt = require('bcryptjs'); 


const getUserByEmail = async (correo) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return rows[0]; 
};


const createUser = async (nombre, apellidos, rut, correo, telefono = null, prevision = null, password, rol = 'paciente') => {
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, apellidos, rut, correo, telefono, prevision, password, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, apellidos, rut, correo, telefono, prevision, hashedPassword, rol]
    );

    return result;
};

module.exports = {
    getUserByEmail,
    createUser
};



