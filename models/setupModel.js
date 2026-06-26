const pool = require('../config/db');

class SetupModel {
    static async probarConexion() {
        const [rows] = await pool.query('SELECT * FROM historial_clinico ORDER BY id_historial DESC LIMIT 5');
        return rows;
    }

    static async crearTablas() {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS disponibilidad_diaria (
                id_disponibilidad INT AUTO_INCREMENT PRIMARY KEY,
                id_profesional INT NOT NULL,
                fecha DATE NOT NULL,
                citas_ocupadas INT DEFAULT 1,
                FOREIGN KEY (id_profesional) REFERENCES profesionales(id_profesional) ON DELETE CASCADE,
                UNIQUE KEY unique_profesional_fecha (id_profesional, fecha)
            )
        `);
        return true;
    }

    static async actualizarEsquemas() {
        const [rows] = await pool.query('DESCRIBE historial_clinico');
        const columns = rows.map(r => r.Field);
        let changes = [];
        if (!columns.includes('presupuesto')) {
            await pool.query('ALTER TABLE historial_clinico ADD COLUMN presupuesto DECIMAL(10,2) DEFAULT 0');
            changes.push("Added presupuesto column");
        }
        if (!columns.includes('id_profesional')) {
            await pool.query('ALTER TABLE historial_clinico ADD COLUMN id_profesional INT');
            changes.push("Added id_profesional column");
        }
        if (!columns.includes('observaciones')) {
            await pool.query('ALTER TABLE historial_clinico ADD COLUMN observaciones TEXT');
            changes.push("Added observaciones column");
        }
        return changes;
    }
}

module.exports = SetupModel;
