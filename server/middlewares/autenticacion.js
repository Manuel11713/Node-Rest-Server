const jwt = require('jsonwebtoken')
    //===================
    //= Verificar Token =
    //===================

let verificaToken = (req, res, next) => { //next hace que el pograma no se detenga

    let token = req.get('token');

    jwt.verify(token, process.env.SEED_PROD, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }


        req.usuario = decoded.usuario;

        next();
    });
};

let VerficaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es Administrador'
            }
        })
    }

}

let VerificaTokenImg = (req, res, next) => {

    let token = req.query.token;
    jwt.verify(token, process.env.SEED_PROD, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }


        req.usuario = decoded.usuario;

        next();
    });
};



module.exports = {
    verificaToken,
    VerficaAdmin_Role,
    VerificaTokenImg
}