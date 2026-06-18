const pool = require('../config/db');

// Obtener todas las citas del sistema (con nombres de paciente y doctor)
const getAllCitas = async () => {
    const query = `
        SELECT c.id_cita, c.fecha, c.hora, c.estado, 
               u.nombre AS paciente_nombre, u.apellidos AS paciente_apellidos,
               proc.nombre AS procedimiento, 
               prof.nombre AS doc_nombre, prof.apellidos AS doc_apellidos
        FROM citas c
        JOIN usuarios u ON c.id_usuario = u.id_usuario
        JOIN procedimientos proc ON c.id_procedimiento = proc.id_procedimiento
        JOIN profesionales prof ON c.id_profesional = prof.id_profesional
        ORDER BY c.fecha ASC, c.hora ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
};

// Obtener estadísticas rápidas para las tarjetas del panel
const getStats = async () => {
    const [pacientes] = await pool.query("SELECT COUNT(*) as total FROM usuarios WHERE rol = 'paciente'");
    const [profesionales] = await pool.query("SELECT COUNT(*) as total FROM profesionales");
    const [citasPendientes] = await pool.query("SELECT COUNT(*) as total FROM citas WHERE estado = 'pendiente'");
    
    return {
        pacientes: pacientes[0].total,
        profesionales: profesionales[0].total,
        citasPendientes: citasPendientes[0].total
    };
};

module.exports = {
    getAllCitas,
    getStats
};