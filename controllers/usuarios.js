'use strict';

let Usuario = require("../models/usuarios");
let auth = require("../helpers/auth");
let bcrypt = require("bcrypt");

let ROLES_VALIDOS = ["administrador", "basico"];

// Punto 1: crear usuario guardando username, password (hasheado) y rol
function registrarUsuario(req, resp){
    let username = req.body.username;
    let password = req.body.password;
    let rol = req.body.rol;

    if (!username || !password || !rol){
        return resp.status(400).send({"message": "Debe enviar username, password y rol"}); // 400: Bad Request
    }

    if (!ROLES_VALIDOS.includes(rol)){
        return resp.status(400).send({"message": "El rol debe ser 'administrador' o 'basico'"});
    }

    let usuario = new Usuario({
        "username": username,
        "password": bcrypt.hashSync(password, 10), // El password se guarda hasheado, nunca en texto plano
        "rol": rol
    });

    usuario.save().then(
        (usuarioCreado) => {
            usuarioCreado.password = undefined; // No devolvemos el password en la respuesta
            resp.status(200).send({"message": "usuario creado", "usuario": usuarioCreado});
        },
        err => {
            // 11000: codigo de Mongo para violacion de indice unico (username repetido)
            if (err.code === 11000){
                return resp.status(409).send({"message": "El username ya está en uso"}); // 409: Conflict
            }
            console.error(err); // El detalle queda en el log del servidor, no se lo mandamos al cliente
            resp.status(500).send({"message": "Error al crear el usuario"});
        }
    );
}

// Punto 1: autenticar consultando la info guardada y devolviendo un token
function loguearUsuario(req, resp){
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password){
        return resp.status(400).send({"message": "Debe enviar un username y password"});
    }

    Usuario.findOne({"username": username}).then(
        (usuario) => {
            if (!usuario){
                return resp.status(404).send({"message": "No existe el usuario"});
            }
            if (!bcrypt.compareSync(password, usuario.password)){
                return resp.status(401).send({"message": "Contraseña incorrecta"});
            }
            resp.status(200).send({"token": auth.crearToken(usuario)});
        },
        err => {
            console.error(err);
            resp.status(500).send({"message": "Error al loguear el usuario"});
        }
    );
}

module.exports = { registrarUsuario, loguearUsuario };
