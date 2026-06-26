const pool = require('../config/db');

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
    try {
        const [rows] = await pool.query(query, [id_usuario]);
        return rows;
    } catch (error) {
        throw new Error(`Error obteniendo citas pendientes: ${error.message}`);
    }
};

const getHistorialClinico = async (id_usuario) => {
    const query = `
        SELECT h.fecha_registro, h.diagnostico, h.tratamiento_realizado, h.presupuesto,
               proc.nombre AS procedimiento
        FROM historial_clinico h
        LEFT JOIN citas c ON h.id_cita = c.id_cita
        LEFT JOIN procedimientos proc ON c.id_procedimiento = proc.id_procedimiento
        WHERE h.id_paciente = ?
        ORDER BY h.fecha_registro DESC
    `;
    try {
        const [rows] = await pool.query(query, [id_usuario]);
        return rows;
    } catch (error) {
        throw new Error(`Error obteniendo historial clínico: ${error.message}`);
    }
};

const cancelCita = async (id_cita, id_usuario) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [citaRows] = await connection.query('SELECT id_profesional, fecha, estado FROM citas WHERE id_cita = ? AND id_usuario = ?', [id_cita, id_usuario]);

        if (citaRows.length === 0 || citaRows[0].estado === 'cancelada') {
            throw new Error("Cita no encontrada o ya cancelada");
        }

        const { id_profesional, fecha } = citaRows[0];

        await connection.query('UPDATE citas SET estado = "cancelada" WHERE id_cita = ?', [id_cita]);

        await connection.query(
            'UPDATE disponibilidad_diaria SET citas_ocupadas = GREATEST(0, citas_ocupadas - 1) WHERE id_profesional = ? AND fecha = ?', 
            [id_profesional, fecha]
        );

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw new Error(`Error cancelando cita: ${error.message}`);
    } finally {
        connection.release();
    }
};

module.exports = {
    getCitasPendientes,
    getHistorialClinico,
    cancelCita
};