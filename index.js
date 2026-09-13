'use strict';

let mongoose = require('mongoose');
let application = require('./applications');

mongoose.connect("mongodb://localhost:27017/parcial_desarrollo_web").then(
    () => {
        console.log("Conexion exitosa");
        application.listen(2508);
        console.log("Servidor corriendo en el puerto 2508");
    },
    err => {
        console.error(err);
    }
);
