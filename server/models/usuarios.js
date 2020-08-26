// El modelo es una referencia a la coleccion usuario en mongo que
// permita realizar insert, update, delete, etc.

// Importar mongoose
const mongoose = require('mongoose');

// Declarar una constante para mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

// Agregar validacion para el campo rol
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido' 
};

// Habilitar en uso de mongoose
mongoose.set('useCreateIndex', true);

// Definir el esquema del modelo
let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
    // Definir los campos de la coleccion
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        // Definir el campo email como unico
        unique: true,
        required: [true, 'El correo es necesario'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        // Agregar valores cerrados a ingresar con enum
        enum: rolesValidos 
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

// Modificar el esquema para omitir contraseña al devolver
// en este NO usar una funcion flecha ya que se necesita el this
usuarioSchema.methods.toJSON = function(){
    // Obtener el objeto usuario, convertirlo a objeto, 
    // eliminar el password y retornarlo.
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject
}

// Indicar al esquema que use el plugin validator
// {PATH} indica el nombre del campo 
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'});

// Exportar el modelo con el nombre Usuario
module.exports = mongoose.model('Usuario', usuarioSchema);