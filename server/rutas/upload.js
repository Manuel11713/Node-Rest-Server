const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs'); //Para poder elminar archivos del fileSystem en node
const path = require('path'); //para poder llegar a los archivos desde las rutas
const Usuario = require('../models/usuario'); //Importamos esquemas con mongoose
const Producto = require('../models/producto');
//importamos el middleware
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No hay archivos cargados'
            }
        });
    }
    //Validar Tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo; //"archivo " es el nombre del input donde se subio el archivo
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];


    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                ext: extension,
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
            }
        })
    }

    //Cambiar nombre al archivo
    let nombreFinal = `${id}-${new Date().getMilliseconds()}.${extension}`; // para prevenir el cache y que sea un nombre unico

    archivo.mv(`uploads/${ tipo }/${nombreFinal}`, err => {
        if (err) {
            res.status(500).json({
                err
            });
        }
        //Aqui la imagen se cargo
        if (tipo === 'usuarios') {
            ImagenUsuario(id, res, nombreFinal);
        } else {
            ImagenProducto(id, res, nombreFinal);
        }



    });

});

let ImagenUsuario = (id, res, nombreFinal) => {
    Usuario.findById(id, (err, usuarioDataB) => {
        if (err) {
            borrarArchivo(nombreFinal, 'usuarios'); //si ocurre un error borramos el archivo que si se subio
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDataB) {
            borrarArchivo(nombreFinal, 'usuarios'); //si ocurre un error borramos el archivo que si se subio
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no Existe'
                }
            });
        }
        borrarArchivo(usuarioDataB.img, 'usuarios');

        usuarioDataB.img = nombreFinal;
        usuarioDataB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreFinal
            })
        });
    });
}


let ImagenProducto = (id, res, nombreFinal) => {
    Producto.findById(id, (err, productoDataB) => {
        if (err) {
            borrarArchivo(nombreFinal, 'productos'); //si ocurre un error borramos el archivo que si se subio
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDataB) {
            borrarArchivo(nombreFinal, 'productos'); //si ocurre un error borramos el archivo que si se subio
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Producto no Existe'
                }
            });
        }

        borrarArchivo(productoDataB.img, 'productos');

        productoDataB.img = nombreFinal;
        productoDataB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreFinal
            })
        });
    })
}




let borrarArchivo = (nombreImagen, tipo) => {
    //Hacemos que solo quede una imagen por cada carga 
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`); //path hacia el archivo cargado
    if (fs.existsSync(pathImagen)) { //si existe la imagen la borra
        fs.unlinkSync(pathImagen);

    }
}

module.exports = app;