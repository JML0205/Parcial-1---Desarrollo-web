'use strict';

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UsuarioSchema = Schema(
    {
        "username": { "type": String, "unique": true },
        "password": String,
        "rol": String // 'administrador' o 'basico'
    }
);

module.exports = mongoose.model('usuarios', UsuarioSchema);
