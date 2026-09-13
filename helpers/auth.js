'use strict';

let jwt = require('jwt-simple');
let moment = require('moment');

let secret = "igqurewt&/.wqeqwe123QAqwe"; // Idealmente esto deberia ir en una variable de entorno

function crearToken(usuario){
    let payload = {
        sub: usuario._id,
        username: usuario.username,
        rol: usuario.rol,
        iat: moment().unix(),
        exp: moment().add(4, 'hours').unix()
    }
    return jwt.encode(payload, secret);
}

// Punto 3 y 4: valida que el usuario este logueado (token valido y no expirado)
function validarToken(req, resp, next){
    try{
        let token = req.headers.authorization.replace("Bearer ", "");
        let payload = jwt.decode(token, secret);

        if (moment().unix() > payload.exp){
            return resp.status(401).send({"message": "Token expirado"}); // 401: No autenticado
        }

        // Guardamos la info del usuario logueado para usarla mas adelante (ej: esAdministrador)
        req.usuarioLogueado = {
            id: payload.sub,
            username: payload.username,
            rol: payload.rol
        };
        next();
    }
    catch(ex){
        resp.status(401).send({"message": "Token invalido"});
    }
}

// Punto 2: valida que el usuario logueado tenga rol administrador
function esAdministrador(req, resp, next){
    if (req.usuarioLogueado && req.usuarioLogueado.rol === 'administrador'){
        next();
    }
    else{
        resp.status(403).send({"message": "No esta autorizado para realizar esta accion"}); // 403: Forbidden
    }
}

module.exports = { crearToken, validarToken, esAdministrador }
