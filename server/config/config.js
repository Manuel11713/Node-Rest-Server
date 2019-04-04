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
    urlDB = 'mongodb+srv://Manuel11713:Spartan11713@cluster0-rhrav.mongodb.net/test?retryWrites=true'
}
process.env.URLDB = urlDB;