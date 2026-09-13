'use strict';

let Pelicula = require("../models/pelicula");

// Punto 2: crear pelicula (solo administrador, validado en la ruta con auth.esAdministrador)
function crearPelicula(req, resp){

    let requestBody = req.body;

    // Que no llegue nada en el requestBody
    if (!requestBody){
        return resp.status(400).send({"message": "no info received"}); // 400: Bad Request
    }
    // Que no lleguen todos los campos obligatorios
    if (!requestBody.titulo || !requestBody.director || !requestBody.anioLanzamiento
            || !requestBody.productora || requestBody.precio === undefined){
        return resp.status(400).send({"message": "missing required fields"});
    }
    // Que titulo, director y productora sean texto (antes de usar .trim(), para no reventar con un numero u objeto)
    if (typeof requestBody.titulo !== 'string' || typeof requestBody.director !== 'string'
            || typeof requestBody.productora !== 'string'){
        return resp.status(400).send({"message": "titulo, director y productora deben ser texto"});
    }
    // Que anioLanzamiento y precio sean numeros válidos
    if (typeof requestBody.anioLanzamiento !== 'number' || isNaN(requestBody.anioLanzamiento)
            || typeof requestBody.precio !== 'number' || isNaN(requestBody.precio)){
        return resp.status(400).send({"message": "anioLanzamiento y precio deben ser numericos"});
    }
    // Que no lleguen valores invalidos en los campos
    if (requestBody.titulo.trim() === '' || requestBody.director.trim() === '' || requestBody.productora.trim() === ''
            || requestBody.precio <= 0 || requestBody.anioLanzamiento <= 0){
        return resp.status(400).send({"message": "invalid values"});
    }

    let nuevaPelicula = new Pelicula({
        "titulo": requestBody.titulo,
        "director": requestBody.director,
        "anioLanzamiento": requestBody.anioLanzamiento,
        "productora": requestBody.productora,
        "precio": requestBody.precio
    });

    nuevaPelicula.save().then(
        (peliculaCreada) => {
            resp.status(201).send({"message": "movie was created", "pelicula": peliculaCreada});
        },
        err => {
            console.error(err);
            resp.status(500).send({"message": "internal error in database"});
        }
    );
}

// Punto 3: consultar todas las peliculas (basico y administrador, solo logueados)
function consultarPeliculas(req, resp){
    Pelicula.find({}).then(
        (peliculas) => {
            resp.status(200).send({"peliculas": peliculas});
        },
        err => {
            console.error(err);
            resp.status(500).send({"message": "internal error in database"});
        }
    );
}

// Punto 4: consultar peliculas con anio > parametro Y precio <= parametro (basico y administrador, solo logueados)
function consultarPeliculasPorFiltro(req, resp){
    let anioMayorA = req.query.anioMayorA;
    let precioMenorOIgualA = req.query.precioMenorOIgualA;

    if (!anioMayorA || !precioMenorOIgualA){
        return resp.status(400).send({"message": "Debe enviar los parametros anioMayorA y precioMenorOIgualA"});
    }

    // Los query params siempre llegan como texto, hay que convertirlos y validar que sean numeros validos
    let anioMayorANum = Number(anioMayorA);
    let precioMenorOIgualANum = Number(precioMenorOIgualA);

    if (isNaN(anioMayorANum) || isNaN(precioMenorOIgualANum)){
        return resp.status(400).send({"message": "anioMayorA y precioMenorOIgualA deben ser numericos"});
    }

    Pelicula.find({
        "anioLanzamiento": {"$gt": anioMayorANum},
        "precio": {"$lte": precioMenorOIgualANum}
    }).then(
        (peliculas) => {
            resp.status(200).send({"peliculas": peliculas});
        },
        err => {
            console.error(err);
            resp.status(500).send({"message": "internal error in database"});
        }
    );
}

module.exports = { crearPelicula, consultarPeliculas, consultarPeliculasPorFiltro };
