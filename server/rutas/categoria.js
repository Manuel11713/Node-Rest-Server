const express = require('express');
let { verificaToken, VerficaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




//Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({}) //Trae todos los registros de la coleccion, con los campos nombre, email, role, estado, google, img
        .sort('descripcion') //ordena por descripcion
        .populate('usuario', 'nombre email') //Revisa que id existe en la categoria solicitada (usuario) y solicita los datos nombre y email
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
            })
        });
});

//Mostrar una categoria por id
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDataB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoriaDataB,
        });

    });
});

//Crear una categoria
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDataB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDataB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDataB
        });
    });
});

//Actualiza categoria
app.put('/categoria/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion }, { new: true, runValidators: true }, (err, categoriaDataB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDataB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: categoriaDataB
        })
    })
});

//Borra una categoria
app.delete('/categoria/:id', [verificaToken, VerficaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: categoriaDeleted,
            message: 'Categoria borrada'
        });
    });

});


module.exports = app;