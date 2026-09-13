# Parcial 1 - Desarrollo Web

Backend en Node.js + Express + MongoDB (Mongoose) que implementa:

1. Registro y autenticación de usuarios (password hasheado con bcrypt, roles `administrador` / `basico`).
2. Creación de películas — solo el rol `administrador`.
3. Consulta de todas las películas — cualquier usuario logueado.
4. Consulta de películas filtradas por año de lanzamiento mayor a X y precio menor o igual a Y — cualquier usuario logueado.

## Integrantes

- Jacobo Morales Londoño
- Samuel Torres Atehortua

## Instalación

```bash
npm install
```

Asegúrate de tener MongoDB corriendo localmente en el puerto por defecto (`mongodb://localhost:27017`).

## Ejecutar

```bash
npm start
```

El servidor queda escuchando en el puerto `2508`.

## Endpoints

### 1. Registrar usuario
`POST /api/usuario/registrar`
```json
{
  "username": "admin1",
  "password": "12345",
  "rol": "administrador"
}
```
`rol` debe ser `"administrador"` o `"basico"`. Si el `username` ya existe, responde `409` (Conflict).

### 2. Login
`POST /api/usuario/login`
```json
{
  "username": "admin1",
  "password": "12345"
}
```
Devuelve `{ "token": "..." }`. Ese token se envía en las siguientes peticiones en el header:
```
Authorization: Bearer <token>
```

### 3. Crear película (solo administrador)
`POST /api/pelicula`
```json
{
  "titulo": "Matrix",
  "director": "Wachowski",
  "anioLanzamiento": 1999,
  "productora": "Warner Bros",
  "precio": 15000
}
```
Si el usuario logueado tiene rol `basico`, responde `403` con mensaje de no autorizado.

### 4. Consultar todas las películas (usuario logueado, cualquier rol)
`GET /api/pelicula`

### 5. Consultar películas filtradas (usuario logueado, cualquier rol)
`GET /api/pelicula/buscar?anioMayorA=2000&precioMenorOIgualA=20000`

Devuelve las películas con `anioLanzamiento > 2000` y `precio <= 20000`.

## Notas

- El password nunca se guarda ni se devuelve en texto plano.
- El token expira a las 4 horas.
- La llave secreta del JWT está hardcodeada en `helpers/auth.js` solo para fines del ejercicio; en un proyecto real debería ir en una variable de entorno (`.env`).
