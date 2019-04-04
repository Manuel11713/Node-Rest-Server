//=====================
//=======PUERTO========
//=====================

process.env.PORT = process.env.PORT || 3000;
//=====================
//======ENTORNO========
//=====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

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