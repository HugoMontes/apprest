// Importar los modulos
const express = require('express');
const bcrypt = require('bcrypt');
// Declarar una constante jwt
const jwt = require('jsonwebtoken');
// Importarel modelo
const Usuario = require('../models/usuarios');
const { rest } = require('underscore');
// Inicializar express
const app = express();
// Crear las peticiones
app.post('/login', (req, res) => {
    // Obtener el email y password
    let body = req.body;
    // Verificar si el correo existe
    // findOne(CONDICION_BUSQUEDA, CALLBACK)
    Usuario.findOne({ email: body.email}, (err, usuarioDB) => {
        // Capturar y retornar error si existe
        if(err){
            // Retornar error 500 error del servidor
            return res.status(500).json({
                ok: false,
                err
            }); 
        }
        // Verificar si existe el usuario
        if(!usuarioDB){
            // Si no existe usuario mandar estado 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                }
            }); 
        }
        // Comparar la contraseña
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrecta'
                }
            });
        }
        // Crear el token el cual contiene un
        // seed = semilla = llave y tiempo de expiracion de una hora
        let token = jwt.sign({
            // Ingresar los datos del payload
            usuario: usuarioDB
        }, process.env.CADUCIDAD_TOKEN, { expiresIn: process.env.SEED });
        // Si todo es correcto enviar el usuario
        return res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});
// Exportar las rutas
module.exports = app;