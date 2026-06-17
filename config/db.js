const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tiendaWeb'
});

db.connect((err) => {
    if (err) {
        console.error('error :', err);
        return;
    }
    else {
        console.log('conectados a la DB');
    }
});
module.exports = db;
