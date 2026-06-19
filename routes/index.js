const express = require('express');
const router = express.Router();

// Ruta principal 
router.get('/', (req, res) => {
    // Renderizamos la vista index.ejs
    res.render('index', {
        title: 'Inicio | Clínica Dental España'
    });
});

module.exports = router;