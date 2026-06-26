const pool = require('../config/db');

const getProfesionales = async () => {
    const query = `SELECT * FROM profesionales`;
    const [rows] = await pool.query(query);
    return rows;
};

const getProcedimientos = async () => {
    const [rows] = await pool.query("SELECT * FROM procedimientos");
    return rows;
};

const getHorasOcupadas = async (id_profesional, fecha) => {
    const query = `SELECT hora FROM citas WHERE id_profesional = ? AND fecha = ? AND estado != 'cancelada'`;
    const [rows] = await pool.query(query, [id_profesional, fecha]);
    return rows.map(r => r.hora.substring(0, 5)); 
};

const createCita = async (id_usuario, id_profesional, id_procedimiento, fecha, hora) => {

    const [dispRows] = await pool.query(
        'SELECT citas_ocupadas FROM disponibilidad_diaria WHERE id_profesional = ? AND fecha = ?', 
        [id_profesional, fecha]
    );

    if (dispRows.length > 0 && dispRows[0].citas_ocupadas >= 9) {
        throw new Error('El profesional ha alcanzado el máximo de citas (9) para este día.');
    }

    const horasOcupadas = await getHorasOcupadas(id_profesional, fecha);
    if (horasOcupadas.includes(hora.substring(0, 5))) {
        throw new Error('La hora seleccionada ya no está disponible.');
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            'INSERT INTO citas (id_usuario, id_profesional, id_procedimiento, fecha, hora, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [id_usuario, id_profesional, id_procedimiento, fecha, hora, 'pendiente']
        );

        await connection.query(
            `INSERT INTO disponibilidad_diaria (id_profesional, fecha, citas_ocupadas) 
             VALUES (?, ?, 1) 
             ON DUPLICATE KEY UPDATE citas_ocupadas = citas_ocupadas + 1`,
            [id_profesional, fecha]
        );

        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    getProfesionales,
    getProcedimientos,
    getHorasOcupadas,
    createCita
};