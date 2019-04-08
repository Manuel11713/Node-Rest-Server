const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { verificaToken, VerficaAdmin_Role } = require('../middlewares/autenticacion') //importamos middleware


app.get('/', function(req, res) {
    res.json('Hello World')
})

app.get('/usuario', verificaToken, (req, res) => { //aqui usamos el middleware como argumento

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.lmite || 0;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img') //Trae todos los registros de la coleccion, con los campos nombre, email, role, estado, google, img
        .skip(desde) //salta los primeros 5 registros
        .limit(limite) //trae solo 5 registros
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })
        });
});

app.post('/usuario', [verificaToken, VerficaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        role: body.role,
        password: bcrypt.hashSync(body.password, 10)
    });
    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});
app.put('/usuario/:id', [verificaToken, VerficaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); //el put solo modificara estos campos

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

});


app.delete('/usuario/:id', [verificaToken, VerficaAdmin_Role], (req, res) => {

    let id = req.params.id;

    let cambiaEstado = { //Cambiamos el estado a false que sera de argumento en la funcion
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

});
module.exports = app;