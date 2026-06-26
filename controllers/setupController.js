const SetupModel = require('../models/setupModel');

exports.runSetup = async (req, res) => {
    try {
        const connectionTest = await SetupModel.probarConexion();
        const tablesCreated = await SetupModel.crearTablas();
        const schemaChanges = await SetupModel.actualizarEsquemas();

        res.json({
            success: true,
            message: "Setup completed successfully",
            details: {
                connectionTestResults: connectionTest,
                tablesCreated: tablesCreated,
                schemaChanges: schemaChanges
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred during setup",
            error: error.message
        });
    }
};
