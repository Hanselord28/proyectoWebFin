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

// Mostrar el formulario de edición con los datos cargados
exports.showEditCita = async (req, res) => {
    // Seguridad: Verificar administrador
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');

    try {
        const idCita = req.params.id;

        // Traemos los datos actuales de la cita, los dentistas y procedimientos
        const cita = await adminModel.getCitaById(idCita);
        const profesionales = await adminModel.getProfesionales();
        const procedimientos = await adminModel.getProcedimientos();

        // Si no existe la cita (fue borrada), regresamos al panel
        if (!cita) return res.redirect('/admin/dashboard');

        // Renderizamos la vista de edición inyectando los datos
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

// Procesar los cambios enviados desde el formulario de edición
exports.processEditCita = async (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');

    try {
        const idCita = req.params.id;
        const { fecha, hora, id_profesional, id_procedimiento, estado } = req.body;

        // Mandamos a actualizar a la base de datos
        await adminModel.updateCita(idCita, fecha, hora, id_profesional, id_procedimiento, estado);

        // Recargamos el panel principal
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Error al actualizar la cita:", error);
        res.status(500).send("Error interno del servidor");
    }
};

// Procesar la eliminación de una cita
exports.deleteCita = async (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');

    try {
        const idCita = req.params.id;

        // Le ordenamos al modelo borrar el registro
        await adminModel.deleteCita(idCita);

        // Recargamos el panel principal
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Error al eliminar la cita:", error);
        res.status(500).send("Error interno del servidor");
    }
};

// Mostrar el formulario para agendar cita manual
exports.showAddCita = async (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');

    try {
        // Traemos las opciones de doctores y procedimientos
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

// API Interna: Buscar paciente por RUT en tiempo real
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

// Guardar la cita agendada manualmente
exports.processAddCita = async (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');

    try {
        // Recibimos todos los datos del formulario, incluyendo el id_usuario oculto
        const { id_usuario, fecha, hora, id_profesional, id_procedimiento } = req.body;

        await adminModel.addCitaAdmin(id_usuario, id_profesional, id_procedimiento, fecha, hora, 'pendiente');

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Error al agendar la cita:", error);
        res.status(500).send("Error interno del servidor al crear cita");
    }
};

// Asegúrate de importar el userModel en la parte superior de tu archivo, junto al adminModel
const userModel = require('../models/userModel');

// Mostrar el formulario para agregar paciente
exports.showAddPaciente = (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');
    res.render('admin/nuevo_paciente', { nombreAdmin: req.session.nombre });
};

// Procesar el registro del paciente desde el panel admin
exports.processAddPaciente = async (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');

    try {
        const { nombre, apellidos, correo, password, rut, telefono, prevision } = req.body;

        // Llamamos a la función que ya tenías creada para registrar usuarios
        // Asignamos 'paciente' como rol por defecto
        await userModel.createUser(nombre, apellidos, correo, password, 'paciente', rut, telefono, prevision);

        // Volvemos al dashboard
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Error al registrar paciente desde admin:", error);
        res.status(500).send("Hubo un error al registrar el paciente. Verifique que el correo o RUT no existan ya.");
    }
};

// Mostrar el formulario para agregar un profesional
exports.showAddProfesional = (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');
    res.render('admin/nuevo_profesional', { nombreAdmin: req.session.nombre });
};

// Procesar el registro del profesional
exports.processAddProfesional = async (req, res) => {
    if (!req.session || req.session.rol !== 'admin') return res.redirect('/');

    try {
        const { nombre, apellidos, rut_personal, rut_profesional, especialidad, correo, password } = req.body;// Recibimos los datos del formulario

        await adminModel.addProfesional(nombre, apellidos, especialidad, correo, password, rut_personal, rut_profesional);// Llamamos a la función del modelo para agregar el profesional a la base de datos

        // Volvemos al dashboard tras el éxito
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Error al registrar profesional:", error);
        res.status(500).send("Hubo un error al registrar. Verifique que el correo o RUT no existan ya.");
    }
};