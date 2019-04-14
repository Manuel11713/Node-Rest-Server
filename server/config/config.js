//=====================
//=======PUERTO========
//=====================

process.env.PORT = process.env.PORT || 3000;
//=====================
//======ENTORNO========
//=====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; // dev == local
//=====================
//==VENCIMIENTO TOKEN==
//=====================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h';
//=====================
//==SEED AUTENTICACION=
//=====================

process.env.SEED_PROD = process.env.SEED_PROD || 'este-es-el-seed-desarrollo';



//=====================
//=====BASE DATOS======
//=====================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI; // variable creada en video 105 'Variables de entorno personalizadas de Heroku'
}
process.env.URLDB = urlDB;


//=====================
//===GOOGLE CLIENT ID==
//=====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '684755180060-4oiauacit9pqso0n651nqfbmud2o0id7.apps.googleusercontent.com';