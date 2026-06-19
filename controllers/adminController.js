const adminModel = require('../models/adminModel');
const userModel = require('../models/userModel');


exports.showDashboard = async (req, res) => {
    
    if (!req.session || req.session.rol !== 'admin') {
        
        return res.redirect('/');
    }

    try {
        
        const citas = await adminModel.getAllCitas();
        const stats = await adminModel.getStats();

        
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


exports.showEditCita = async (req, res) => {
    
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');

    try {
        const idCita = req.params.id;

        
        const cita = await adminModel.getCitaById(idCita);
        const profesionales = await adminModel.getProfesionales();
        const procedimientos = await adminModel.getProcedimientos();

        
        if (!cita) return res.redirect('/admin/dashboard');

        
        res.render('admin/editar_cita', {
            cita,
            profesionales,
            procedimientos,
            nombreAdmin: req.session.nombre
        });
    } catch (error) {
        console.error("Error al cargar vista de edición:", error);
        res.status(500).send("Error interno del servidor");
    }
};


exports.processEditCita = async (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');

    try {
        const idCita = req.params.id;
        const { fecha, hora, id_profesional, id_procedimiento, estado } = req.body;

        
        await adminModel.updateCita(idCita, fecha, hora, id_profesional, id_procedimiento, estado);

        
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Error al actualizar la cita:", error);
        res.status(500).send("Error interno del servidor");
    }
};


exports.deleteCita = async (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');

    try {
        const idCita = req.params.id;

        
        await adminModel.deleteCita(idCita);

        
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Error al eliminar la cita:", error);
        res.status(500).send("Error interno del servidor");
    }
};


exports.showAddCita = async (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');

    try {
        
        const profesionales = await adminModel.getProfesionales();
        const procedimientos = await adminModel.getProcedimientos();

        res.render('admin/nueva_cita', {
            profesionales,
            procedimientos,
            nombreAdmin: req.session.nombre
        });
    } catch (error) {
        console.error("Error al cargar vista de nueva cita:", error);
        res.status(500).send("Error interno del servidor");
    }
};


exports.buscarPacientePorRut = async (req, res) => {
    if (!req.session || req.session.rol !== 'admin') {
        return res.status(403).json({ error: "No autorizado" });
    }

    try {
        const { rut } = req.body;
        const paciente = await adminModel.getPacienteByRut(rut);

        if (paciente) {
            res.json({ success: true, paciente });
        } else {
            res.json({ success: false, message: "Paciente no encontrado" });
        }
    } catch (error) {
        console.error("Error al buscar paciente:", error);
        res.status(500).json({ success: false, error: "Error en el servidor" });
    }
};


exports.processAddCita = async (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');

    try {
        
        const { id_usuario, fecha, hora, id_profesional, id_procedimiento } = req.body;

        await adminModel.addCitaAdmin(id_usuario, id_profesional, id_procedimiento, fecha, hora, 'pendiente');

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Error al agendar la cita:", error);
        res.status(500).send("Error interno del servidor al crear cita");
    }
};


exports.showAddPaciente = (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');
    res.render('admin/nuevo_paciente', { nombreAdmin: req.session.nombre });
};


exports.processAddPaciente = async (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');

    try {
        const { nombre, apellidos, correo, password, rut, telefono, prevision } = req.body;

        
        
        await userModel.createUser(nombre, apellidos, rut, correo, telefono, prevision, password, 'paciente');

        
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Error al registrar paciente desde admin:", error);
        res.status(500).send("Hubo un error al registrar el paciente. Verifique que el correo o RUT no existan ya.");
    }
};


exports.showAddProfesional = (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');
    res.render('admin/nuevo_profesional', { nombreAdmin: req.session.nombre });
};


exports.processAddProfesional = async (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');

    try {
        const { nombre, apellidos, rut_personal, rut_profesional, especialidad, correo, password } = req.body;

        await adminModel.addProfesional(nombre, apellidos, especialidad, correo, password, rut_personal, rut_profesional);

        
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Error al registrar profesional:", error);
        res.status(500).send("Hubo un error al registrar. Verifique que el correo o RUT no existan ya.");
    }
};