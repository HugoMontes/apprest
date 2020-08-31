// ==================================
// PUERTO
// ==================================
process.env.PORT = process.env.PORT || 3000;

// ==================================
// ENTORNO
// ==================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; 

// ==================================
// BASE DE DATOS
// ==================================
// 
let urldb;
if(process.env.NODE_ENV === 'dev'){
    urldb = 'mongodb://localhost:27017/apprestdb';
}else{
    urldb = 'CADENA_CONEXION_DB_PRODUCCION';
}
process.env.URL_DB = urldb;

// ==================================
// VENCIMIENTO DEL TOKEN
// ==================================
// 60 min * 60 seg = 1 hora
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24;

// ==================================
// SEED DE ATUTENTICACION
// ==================================
process.env.SEED = process.env.SEED || 'secret';
