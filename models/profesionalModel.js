const pool = require('../config/db');


const getProfesionalByEmail = async (correo) => {
    const [rows] = await pool.query('SELECT * FROM profesionales WHERE correo = ?', [correo]);
    return rows[0];
};


const getCitasByProfesional = async (id_profesional) => {
    const query = `
        SELECT c.id_cita, c.fecha, c.hora, c.estado,
               u.nombre AS paciente_nombre, u.apellidos AS paciente_apellidos, u.rut,
               p.nombre AS procedimiento
        FROM citas c
        JOIN usuarios u ON c.id_usuario = u.id_usuario
        JOIN procedimientos p ON c.id_procedimiento = p.id_procedimiento
        WHERE c.id_profesional = ? AND c.estado = 'pendiente'
        ORDER BY c.fecha ASC, c.hora ASC
    `;
    const [rows] = await pool.query(query, [id_profesional]);
    return rows;
};


const getPacienteByRut = async (rut) => {
    const [rows] = await pool.query("SELECT id_usuario, nombre, apellidos, rut, correo, telefono, prevision FROM usuarios WHERE rut = ? AND rol = 'paciente'", [rut]);
    return rows[0];
};


const getHistorialPaciente = async (id_paciente) => {
    const query = `
        SELECT h.fecha_registro, h.diagnostico, h.tratamiento_realizado,
               p.nombre AS procedimiento
        FROM historial_clinico h
        LEFT JOIN citas c ON h.id_cita = c.id_cita
        LEFT JOIN procedimientos p ON c.id_procedimiento = p.id_procedimiento
        WHERE h.id_paciente = ?
        ORDER BY h.fecha_registro DESC
    `;
    const [rows] = await pool.query(query, [id_paciente]);
    return rows;
};

module.exports = {
    getProfesionalByEmail,
    getCitasByProfesional,
    getPacienteByRut,
    getHistorialPaciente
};