require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.urlencoded({ extended: false })); 
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_super_mega_hiper_secreta_para_sesiones',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use((req, res, next) => {
    res.locals.isLogged = req.session && req.session.userId ? true : false;
    res.locals.userRol = req.session ? req.session.rol : null;
    res.locals.nombreUsuario = req.session ? req.session.nombre : null;
    next();
});

const pacienteRoutes = require('./routes/paciente');
app.use('/paciente', pacienteRoutes);

app.get('/', (req, res) => {
    res.render('index', { titulo: 'Clínica Dental España' }); 
});

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const citasRoutes = require('./routes/cita'); 
app.use('/citas', citasRoutes);

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const profesionalRoutes = require('./routes/profesional');
app.use('/profesional', profesionalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});