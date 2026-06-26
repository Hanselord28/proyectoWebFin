const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    res.render('index', {
        title: 'Inicio | Clínica Dental España'
    });
});

module.exports = router;