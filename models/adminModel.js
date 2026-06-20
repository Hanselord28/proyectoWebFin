const pool = require('../config/db');

const bcrypt = require('bcryptjs');


const getAllCitas = async () => {
    const query = `
        SELECT c.*, 
               u.nombre AS paciente_nombre, u.apellidos AS paciente_apellidos,
               p.nombre AS doc_nombre, p.apellidos AS doc_apellidos,
               pr.nombre AS procedimiento
        FROM citas c
        JOIN usuarios u ON c.id_usuario = u.id_usuario
        JOIN profesionales p ON c.id_profesional = p.id_profesional
        JOIN procedimientos pr ON c.id_procedimiento = pr.id_procedimiento
        ORDER BY c.fecha ASC, c.hora ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
};


const getStats = async () => {
    
    const [citasPendientes] = await pool.query('SELECT COUNT(*) as total FROM citas WHERE estado = "pendiente"');
    const [pacientes] = await pool.query('SELECT COUNT(*) as total FROM usuarios WHERE rol = "paciente"');
    const [profesionales] = await pool.query('SELECT COUNT(*) as total FROM profesionales');

    return {
        citasPendientes: citasPendientes[0].total,
        pacientes: pacientes[0].total,
        profesionales: profesionales[0].total
    };
};

const getCitaById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM citas WHERE id_cita = ?', [id]);
    return rows[0];
};


const updateCita = async (id, fecha, hora, id_profesional, id_procedimiento, estado) => {
    await pool.query(
        'UPDATE citas SET fecha = ?, hora = ?, id_profesional = ?, id_procedimiento = ?, estado = ? WHERE id_cita = ?',
        [fecha, hora, id_profesional, id_procedimiento, estado, id]
    );
};


const deleteCita = async (id) => {
    await pool.query('DELETE FROM citas WHERE id_cita = ?', [id]);
};


const getProfesionales = async () => {
    const [rows] = await pool.query('SELECT id_profesional, nombre, apellidos FROM profesionales');
    return rows;
};


const getProcedimientos = async () => {
    const [rows] = await pool.query('SELECT * FROM procedimientos');
    return rows;
};


const getPacienteByRut = async (rut) => {
    const [rows] = await pool.query(
        'SELECT id_usuario, nombre, apellidos, correo, telefono FROM usuarios WHERE rut = ? AND rol = "paciente"', 
        [rut]
    );
    return rows[0]; 
};


const addCitaAdmin = async (id_usuario, id_profesional, id_procedimiento, fecha, hora, estado) => {
    await pool.query(
        'INSERT INTO citas (id_usuario, id_profesional, id_procedimiento, fecha, hora, estado) VALUES (?, ?, ?, ?, ?, ?)',
        [id_usuario, id_profesional, id_procedimiento, fecha, hora, estado]
    );
};

const addProfesional = async (nombre, apellidos, especialidad, correo, password, rut_personal, rut_profesional) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
        'INSERT INTO profesionales (nombre, apellidos, especialidad, correo, password, rut_personal, rut_profesional) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, apellidos, especialidad, correo, hashedPassword, rut_personal, rut_profesional]
    );
};

// Obtener todos los profesionales (listado completo)
const getAllProfesionalesFull = async () => {
    const [rows] = await pool.query('SELECT * FROM profesionales ORDER BY nombre ASC');
    return rows;
};

// Obtener un profesional por ID
const getProfesionalById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM profesionales WHERE id_profesional = ?', [id]);
    return rows[0];
};

// Actualizar un profesional
const updateProfesional = async (id, nombre, apellidos, especialidad, correo, password, rut_personal, rut_profesional) => {
    if (password && password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await pool.query(
            'UPDATE profesionales SET nombre = ?, apellidos = ?, especialidad = ?, correo = ?, password = ?, rut_personal = ?, rut_profesional = ? WHERE id_profesional = ?',
            [nombre, apellidos, especialidad, correo, hashedPassword, rut_personal, rut_profesional, id]
        );
    } else {
        await pool.query(
            'UPDATE profesionales SET nombre = ?, apellidos = ?, especialidad = ?, correo = ?, rut_personal = ?, rut_profesional = ? WHERE id_profesional = ?',
            [nombre, apellidos, especialidad, correo, rut_personal, rut_profesional, id]
        );
    }
};

// Eliminar un profesional
const deleteProfesional = async (id) => {
    await pool.query('DELETE FROM profesionales WHERE id_profesional = ?', [id]);
};

module.exports = {
    getAllCitas,
    getStats,
    getCitaById,
    updateCita,
    deleteCita,
    getProfesionales,
    getProcedimientos,
    addProfesional,
    getPacienteByRut,
    addCitaAdmin,
    getAllProfesionalesFull,
    getProfesionalById,
    updateProfesional,
    deleteProfesional
};