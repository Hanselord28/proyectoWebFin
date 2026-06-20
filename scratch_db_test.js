const pool = require('./config/db');

async function test() {
    try {
        const [rows] = await pool.query('SELECT * FROM historial_clinico ORDER BY id_historial DESC LIMIT 5');
        console.log(rows);
    } catch(err) {
        console.error(err);
    }
    process.exit(0);
}
test();
