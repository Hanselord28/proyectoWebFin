const adminModel = require('../models/adminModel');

// Mostrar el Panel Principal
exports.showDashboard = async (req, res) => {
    // 1. SEGURIDAD: Verificar que sea un Administrador
    if (!req.session || req.session.rol !== 'admin') {
        // Si no es admin, lo mandamos a la página de inicio
        return res.redirect('/');
    }

    try {
        // 2. Traer datos de la base de datos
        const citas = await adminModel.getAllCitas();
        const stats = await adminModel.getStats();

        // 3. Renderizar la vista
        res.render('admin/dashboard', {
            nombreAdmin: req.session.nombre,
            citas: citas,
            stats: stats
        });

    } catch (error) {
        console.error("Error al cargar el panel de administrador:", error);
        res.status(500).send("Error interno del servidor");
    }
};