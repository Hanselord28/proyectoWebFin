require('dotenv').config();
const pool = require('./config/db');

async function checkSchema() {
    try {
        const [rows] = await pool.query('DESCRIBE historial_clinico');
        console.log("historial_clinico schema:", rows);
        
        // Add new columns if they don't exist
        const columns = rows.map(r => r.Field);
        if (!columns.includes('presupuesto')) {
            await pool.query('ALTER TABLE historial_clinico ADD COLUMN presupuesto DECIMAL(10,2) DEFAULT 0');
            console.log("Added presupuesto column");
        }
        if (!columns.includes('id_profesional')) {
            await pool.query('ALTER TABLE historial_clinico ADD COLUMN id_profesional INT');
            // Assuming fk to profesionales
            // await pool.query('ALTER TABLE historial_clinico ADD FOREIGN KEY (id_profesional) REFERENCES profesionales(id_profesional)');
            console.log("Added id_profesional column");
        }
        if (!columns.includes('observaciones')) {
            await pool.query('ALTER TABLE historial_clinico ADD COLUMN observaciones TEXT');
            console.log("Added observaciones column");
        }
        
        const [rows2] = await pool.query('DESCRIBE historial_clinico');
        console.log("Updated schema:", rows2);
        
    } catch(err) {
        console.error(err);
    }
    process.exit(0);
}
checkSchema();
