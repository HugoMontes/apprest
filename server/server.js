// Hacer uso del archivo de configuracion
require('./config/config');
// Importar el modulo express
const express = require('express');
// Instanciar express
const app = express();
// Iniciar body-parser
const bodyParser = require('body-parser');

// Importar mongoose
const mongoose = require('mongoose');

// Agrear los middleware para permitir formatear 
// datos desde cualquier peticion GET, POST, PUT, DELTE

// Middleware para parsear peticiones 
// de application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Middleware para parsear datos a formato application/json
app.use(bodyParser.json());

// Importar el archivo de rutas
app.use(require('./routes/routes'));

// Indicar la cadena de conexion
// Indicar el puerto por defecto de mongo 27017
// Indicar el nombre de la base de datos, no es necesario
// crearlo en mongo ya que mongoose lo crea automaticamente si no existe
// Activar useNewUrlParser y useUnifiedTopology para su funcionamiento
// La funcion connect recibe un callback para verificar si se ha conectado
mongoose.connect(process.env.URL_DB, {
    // Parametros necesario para identificar la url de mongo
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => { 
        // Ejecutar una excepcion si no se conecta
        if(err) throw err;
        // En caso que se conecte mostrar un mensaje
        console.log('Base de datos ONLINE');
    });

// Obtener el puerto desde la variable global
app.listen(process.env.PORT, () => {
    console.log('START SERVER...');
    console.log('- Execute in browser http://localhost:'+process.env.PORT);
});
