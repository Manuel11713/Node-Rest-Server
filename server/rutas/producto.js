const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//Obtener Productos
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Producto.find({ disponible: true }) //Trae todos los registros de la coleccion, con los campos nombre, email, role, estado, google, img
        .populate('usuario', 'nombre email') //Revisa que id existe en la categoria solicitada (usuario) y solicita los datos nombre y email
        .populate('categoria', 'descripcion')
        .skip(desde) //salta los primeros 5 registros
        .limit(limite) //trae solo 5 registros
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Producto.count((err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            })
        });
});

//Obtener un solo Producto 
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email') //Revisa que id existe en la categoria solicitada (usuario) y solicita los datos nombre y email
        .populate('categoria', 'descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categorias,
            });

        });
});

//Crear un producto
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        categoria: body.categoria
    });
    producto.save((err, productoDataB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDataB
        });
    });

});

//Modificar un producto
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    const modificacion = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
    }

    Producto.findByIdAndUpdate(id, modificacion, { new: true, runValidators: true }, (err, productoDataB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDataB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }
        res.json({
            ok: true,
            usuario: productoDataB
        });
    });
});

//Borrar un producto
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDeleted,
            message: 'Producto Eliminado'
        });


    })
});

//Buscar un un producto personalizado
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let expresionRegular = new RegExp(termino, 'i'); //i= para que sea insensible a mayusculas y minusculas

    Producto.find({ nombre: expresionRegular })
        .populate('categoria', 'descripcion')
        .exec((err, ProductoDataB) => {
            if (err) {
                res.json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                ProductoDataB
            })
        })

})

module.exports = app;