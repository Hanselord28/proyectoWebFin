const pool = require('../config/db');

// Obtener citas pendientes del paciente
const getCitasPendientes = async (id_usuario) => {
    const query = `
        SELECT c.id_cita, c.fecha, c.hora, c.estado, 
               proc.nombre AS procedimiento, 
               prof.nombre AS doc_nombre, prof.apellidos AS doc_apellidos
        FROM citas c
        JOIN procedimientos proc ON c.id_procedimiento = proc.id_procedimiento
        JOIN profesionales prof ON c.id_profesional = prof.id_profesional
        WHERE c.id_usuario = ? AND c.estado = 'pendiente'
        ORDER BY c.fecha ASC, c.hora ASC
    `;
    const [rows] = await pool.query(query, [id_usuario]);
    return rows;
};

// Obtener historial clínico del paciente
const getHistorialClinico = async (id_usuario) => {
    const query = `
        SELECT h.fecha_registro, h.diagnostico, h.tratamiento_realizado,
               proc.nombre AS procedimiento
        FROM historial_clinico h
        LEFT JOIN citas c ON h.id_cita = c.id_cita
        LEFT JOIN procedimientos proc ON c.id_procedimiento = proc.id_procedimiento
        WHERE h.id_paciente = ?
        ORDER BY h.fecha_registro DESC
    `;
    const [rows] = await pool.query(query, [id_usuario]);
    return rows;
};

module.exports = {
    getCitasPendientes,
    getHistorialClinico
};