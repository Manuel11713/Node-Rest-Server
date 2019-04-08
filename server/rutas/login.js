const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o Contraseña Incorrectos'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) { //compara la contraseña del body y la de la base de datos
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (Contraseña) Incorrectos'
                }
            })
        }
        let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED_PROD, { expiresIn: process.env.CADUCIDAD_TOKEN }) //expirara en 30 dias
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});

module.exports = app;