require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser')


app.use(require('./rutas/index')) //importamos todas las rutas


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) //Middleware
    // parse application/json
app.use(bodyParser.json()) //Middleware

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de Datos Online');
});

app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto: ", process.env.PORT);
})