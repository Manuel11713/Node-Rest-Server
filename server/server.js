require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser')
const path = require('path'); //Esto lo usamos para hablitar la carpeta public

app.use(require('./rutas/index')) //importamos todas las rutas


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) //Middleware
    // parse application/json
app.use(bodyParser.json()) //Middleware


//Habilitar la carpeta Public
app.use(express.static(path.resolve(__dirname, '../public')));
//console.log(path.resolve(__dirname, '../public'));

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de Datos Online');
});

app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto: ", process.env.PORT);
})