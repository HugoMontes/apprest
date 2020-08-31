// Importar la libreria de jwt
const jwt = require('jsonwebtoken');

// ==========================
// Verificar token valido
// ==========================
let verificaToken = (req, res, next) => {
    // Obtener el token de la cabecera
    // alunos usan el nombre autentication, auth o token
    let token = req.get('token');
    // console.log(process.env.SEED);
    // console.log(token);

    // Verificar el token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        // Si existe error
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        // Si no existe error
        // obtener del payload el usuario
        req.usuario = decoded.usuario;
        // Continuar con la aplicacion
        next();
    });
};

// ==========================
// Verifica AdminRole
// ==========================
let verificaAdminRole = (req, res, next) => {
    // Obtener los datos del usuario
    let usuario = req.usuario;
    // Verificar si el usuario es administrador
    if(usuario.role === 'ADMIN_ROLE'){
        // Si es administrador continuar con los procesos
        next();
    }else{
        // Si no es administrador retornar json con error
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

// Exportar la funcion
module.exports = {
    verificaToken,
    verificaAdminRole
};