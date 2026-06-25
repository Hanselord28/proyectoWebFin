require('dotenv').config();
const db = require('./config/db');

async function run() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS disponibilidad_diaria (
                id_disponibilidad INT AUTO_INCREMENT PRIMARY KEY,
                id_profesional INT NOT NULL,
                fecha DATE NOT NULL,
                citas_ocupadas INT DEFAULT 1,
                FOREIGN KEY (id_profesional) REFERENCES profesionales(id_profesional) ON DELETE CASCADE,
                UNIQUE KEY unique_profesional_fecha (id_profesional, fecha)
            )
        `);
        console.log("Tabla disponibilidad_diaria creada exitosamente");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
run();
