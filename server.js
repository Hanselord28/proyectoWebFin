const mysql = require('mysql2');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;


//le decimos a la app que espere en el puerto 3000 para recibir las peticiones
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
//==============================================================

//recibe el router de productos y lo utiliza para manejar las rutas relacionadas con productos

productoRouter = require('./routes/productoRoutes');
app.use('/api/productos', productoRouter);


