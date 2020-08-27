// Importar el modulo express
const express = require('express');
// Instanciar express
const app = express();

// Importar las rutas
app.use(require('./usuario'));

// Exportar la instancia de express
module.exports = app;
