// Importar el modulo express
const express = require('express');

// Declara una variable para brypt
const bcrypt = require('bcrypt');

// Crear la variable que usualmente es _
const _ = require('underscore');

// Instanciar express
const app = express();
// Importar el modelo de usuario
const Usuario = require('../models/usuarios');

app.get('/usuario', (req, res) => {
    // Parametros opcionales

    // Obtener desde que registro se va mostrar
    // en caso de no enviar toma el valor por defecto 0
    let desde = req.query.desde || 0;
    // Convertir en numero
    desde = Number(desde);
    // Obtener hasta que registro se va mostrar
    // en caso de no enviar toma el valor por defecto 5    
    let limite = req.query.limite || 5;
    limite = Number(limite);
    // Obtener todos los usuarios
    // find({CRITERIOS_BUSQUEDA})
    // -- Agregar la condicion para obtener unicamente registros activos 
    Usuario.find({estado: true}, 'nombre email role estado')
        // Indicar el salto de registros 
        // desde donde empezara a mostrar
        .skip(desde)
        // Agregar un limite de 5 registros
        .limit(limite)
        // Obtenemos un error o los usuarios
        .exec( (err, usuarios) => {
             // Preguntar si existe algun error
            if(err){
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            // En caso que no exista error
            // Contar cantidad de registros
            // count({CRITERIOS_BUSQUEDA}, CALLBACK)
            Usuario.count({estado: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    total: conteo 
                });
            });           
        });
});

app.post('/usuario', (req, res) => {
    // Obtener el payload (cuerpo de la peticion)
    let body = req.body;
    // Instanciar un objeto del modelo pasandole
    // los datos que se encuentran en el body
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // Aplicar el cifrado con 10 vueltas
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    // Guardar en la base de datos
    // Recibe un error u el usuario guardado en mongo
    usuario.save((err, usuarioDB) => {
        // Preguntar si existe algun error
        if(err){
            // Si existe error mandar estado 400 bad request
            // y salir de la funcion
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        // En caso que no exista error mandar el objeto
        // no es necesario mandar estado 200(es implicito)
        res.json({
            ok: true,
            usuario: usuarioDB,
        })
    });
});

app.put('/usuario/:id', (req, res) => {
    // Obtener el id del registro
    let id = req.params.id;
    // Obtener del body unicamente los valores a modificar
    // pick retorna una copia del objeto, filtrando unicamente
    // los valores que se desean recuperar de body
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    // Buscar por el id y actualizar si lo encuentra
    // new indica que se va devolver el objeto actualizado en usuarioDB
    // runValidator indica si va implementar las validaciones definidas
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        // Preguntar si existe algun error
        if(err){
            // Si existe error mandar estado 400 bad request
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        // En caso de no existir error, enviar una respuesta
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });    
});

// Eliminar registro
app.delete('/usuario/:id', function(req, res) {
    // Obtener el id del registro a eliminar    
    let id = req.params.id;

    // Eliminar el registro fisicamente
    // findByIdAndRemove(ID_ELIMINAR, CALLBACK)
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    // -- Declarar una varible con los campos a editar
    let cambiaEstado = {
        // Cambiar el estado a falase
        estado: false
    };

    // -- Actualizar el valor de estado del registro
    // -- findByIdAndUpdate(ID_OBJETO, CAMPOS_ACTUALIZAR, CALLBACK)    
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {
        // Evaluar si existe error
        if(err){
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        // Evaluar si no se ha eliminado un usuario
        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                },
            });
        }
        // Si no existe error retornar usuario eliminado
        res.json({
            ok: true,
            usuario: usuarioBorrado,
        });
    });
});

// Exportar la constante app
module.exports = app;
