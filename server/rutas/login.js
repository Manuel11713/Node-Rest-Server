const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

//---Constantes de la aplicacion de google y su pagina
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID); //se configuro en config
//--Constantes de la aplicacion de google y su pagina

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


//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}



app.post('/google', async(req, res) => {

    let token = req.body.idtoken //esto viene de la pagina de google (index.html)
    console.log(token);
    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            })
        })



    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (usuarioDB) {
                if (usuarioDB.google === false) { //si no se ha autenticado por google pero si por otra forma
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Debe de usar su autenticacion normal'
                        }
                    });
                } else {
                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED_PROD, { expiresIn: process.env.CADUCIDAD_TOKEN }); //expirara en 30 dias

                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token,
                    })
                }
            } else { //Si el usuario no existe en nuestra base de datos
                let usuario = new Usuario();
                usuario.nombre = googleUser.nombre;
                usuario.email = googleUser.email;
                usuario.img = googleUser.img;
                usuario.google = true;
                usuario.password = ":)";

                usuario.save((err, usuarioDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }
                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED_PROD, { expiresIn: process.env.CADUCIDAD_TOKEN }); //expirara en 30 dias

                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token,
                    })


                })
            }

        })
        // res.json({
        //     usuario: googleUser
        // });
});

module.exports = app;