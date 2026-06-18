require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public'))); // Para tu CSS o Bootstrap local
app.use(express.urlencoded({ extended: false })); // Para procesar datos de formularios
app.use(express.json());

// Configuración de Sesiones (Login)
app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_super_mega_hiper_secreta_para_sesiones',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambiar a true si usas HTTPS
}));

// Middleware para pasar variables de sesión a todas las vistas (.ejs)
app.use((req, res, next) => {
    res.locals.isLogged = req.session && req.session.userId ? true : false;
    res.locals.userRol = req.session ? req.session.rol : null;
    next();
});


// Rutas base (Ejemplo de conexión a los archivos en /routes)
//app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
// app.use('/admin', require('./routes/admin'));












const pacienteRoutes = require('./routes/paciente');
app.use('/paciente', pacienteRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.render('index', { titulo: 'Clínica Dental España' }); 
});

// Importar y usar la ruta de autenticación
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);


// Importar y conectar el sistema de rutas de citas
const citasRoutes = require('./routes/cita'); 
app.use('/citas', citasRoutes);

// Importar y conectar el sistema de rutas de administrador
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);








// Iniciar el servidor

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});