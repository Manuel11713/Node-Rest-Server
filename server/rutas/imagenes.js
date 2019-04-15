 const express = require('express');
 const app = express();
 const fs = require('fs');
 const path = require('path');
 const { VerificaTokenImg } = require('../middlewares/autenticacion');

 app.get('/imagen/:tipo/:img', VerificaTokenImg, (req, res) => {

     let tipo = req.params.tipo;
     let img = req.params.img;

     let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`); //Este es el path absoluto de imagen requerida (no-image).


     if (fs.existsSync(pathImagen)) {
         return res.sendFile(pathImagen)
     } else {
         let noImagenPath = path.resolve(__dirname, '../assets/no-image.jpg'); //Este es el path absoluto de imagen (no-image).
         return res.sendFile(noImagenPath);
     }

 });

 module.exports = app;