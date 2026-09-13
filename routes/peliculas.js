'use strict';

let express = require('express');
let router = express.Router();
let peliculaController = require("../controllers/peliculas");
let auth = require("../helpers/auth");

// Punto 2: solo el administrador puede crear peliculas
router.post("/api/pelicula", auth.validarToken, auth.esAdministrador, peliculaController.crearPelicula);

// Punto 3: basico y administrador, solo si estan logueados, consultan todas las peliculas
router.get("/api/pelicula", auth.validarToken, peliculaController.consultarPeliculas);

// Punto 4: basico y administrador, solo si estan logueados, filtran por anio y precio
router.get("/api/pelicula/buscar", auth.validarToken, peliculaController.consultarPeliculasPorFiltro);

module.exports = router;
