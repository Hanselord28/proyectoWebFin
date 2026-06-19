const pool = require('../config/db');

// Obtener todos los profesionales activos
// Obtener todos los profesionales disponibles
const getProfesionales = async () => {
    const query = `SELECT * FROM profesionales`;
    const [rows] = await pool.query(query);
    return rows;
};

// Obtener todos los procedimientos
const getProcedimientos = async () => {
    const [rows] = await pool.query("SELECT * FROM procedimientos");
    return rows;
};

// Crear la cita en la base de datos
const createCita = async (id_usuario, id_profesional, id_procedimiento, fecha, hora) => {
    const [result] = await pool.query(
        'INSERT INTO citas (id_usuario, id_profesional, id_procedimiento, fecha, hora, estado) VALUES (?, ?, ?, ?, ?, ?)',
        [id_usuario, id_profesional, id_procedimiento, fecha, hora, 'pendiente']
    );
    return result;
};

module.exports = {
    getProfesionales,
    getProcedimientos,
    createCita
};