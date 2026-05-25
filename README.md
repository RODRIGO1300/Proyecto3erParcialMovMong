# MyApiWithMongodb

Guia de estudio para entender, ejecutar y crear desde cero una API REST con Node.js, Express, MongoDB y Mongoose.

Este proyecto es una API sencilla para administrar libros. Una API es un programa que recibe peticiones por internet o por red local y responde con datos. En este caso, la API permite guardar, consultar, actualizar y eliminar libros en una base de datos MongoDB.

## Objetivo del proyecto

El proyecto sirve para practicar una API con operaciones CRUD:

- `Create`: crear un libro nuevo.
- `Read`: leer o consultar libros.
- `Update`: actualizar un libro existente.
- `Delete`: eliminar un libro.

CRUD es una palabra muy importante para examen porque resume las acciones basicas que casi cualquier sistema hace con sus datos.

## Tecnologias usadas

### Node.js

Node.js permite ejecutar JavaScript fuera del navegador. Normalmente JavaScript se usa en paginas web, pero con Node.js tambien se puede crear un servidor.

En este proyecto Node.js ejecuta el archivo principal:

```bash
node app.js
```

### Express

Express es un framework para crear servidores web y APIs de forma mas sencilla.

Sin Express tendriamos que escribir mucho codigo para recibir peticiones HTTP. Con Express podemos escribir rutas como:

```js
router.get('/', (req, res) => {
  res.json(...)
});
```

### MongoDB

MongoDB es una base de datos NoSQL. En lugar de guardar informacion en tablas como MySQL, guarda documentos parecidos a objetos JSON.

Ejemplo de un documento de libro:

```json
{
  "_id": "665...",
  "title": "El Principito",
  "description": "Libro corto sobre amistad e imaginacion"
}
```

### Mongoose

Mongoose es una libreria que conecta Node.js con MongoDB. Tambien permite definir modelos, es decir, la forma que deben tener los datos.

En este proyecto se usa para definir que un libro debe tener:

- `title`: texto obligatorio.
- `description`: texto opcional.

### CORS

CORS permite que una aplicacion frontend, por ejemplo una app web hecha en React, Angular o Vue, pueda comunicarse con esta API aunque este en otro puerto o dominio.

### body-parser

`body-parser` permite que Express lea datos enviados en formato JSON dentro del cuerpo de una peticion.

Ejemplo de cuerpo JSON:

```json
{
  "title": "Clean Code",
  "description": "Libro sobre buenas practicas de programacion"
}
```

## Estructura del proyecto

```text
MyApiWithMongodb/
├── app.js
├── package.json
├── package-lock.json
├── Readme.txt
├── README.md
├── models/
│   └── book.js
├── routes/
│   └── books.js
└── node_modules/
```

### `app.js`

Es el archivo principal. Aqui se configura y se inicia el servidor.

Responsabilidades de `app.js`:

- Importar librerias.
- Crear la aplicacion de Express.
- Activar CORS.
- Permitir lectura de JSON.
- Conectar las rutas de libros.
- Conectar con MongoDB.
- Levantar el servidor en el puerto `4000`.

Codigo importante:

```js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const boooks = require('./routes/books');
```

Estas lineas importan las dependencias necesarias.

```js
const app = express();
```

Crea la aplicacion de Express.

```js
app.use(cors());
app.use(bodyParser.json());
```

Estas lineas activan middlewares.

Un middleware es una funcion que se ejecuta entre la peticion del cliente y la respuesta del servidor.

```js
app.use('/api/books', boooks);
```

Esto significa que todas las rutas definidas en `routes/books.js` empiezan con:

```text
/api/books
```

Por ejemplo, si en `books.js` existe una ruta `GET /`, realmente se accede como:

```text
GET http://localhost:4000/api/books
```

```js
mongoose.connect('mongodb+srv://...')
```

Conecta la aplicacion con MongoDB Atlas.

```js
app.listen(4000);
```

Inicia el servidor en el puerto `4000`.

La URL base del proyecto es:

```text
http://localhost:4000
```

## Modelo de datos

El modelo esta en:

```text
models/book.js
```

Contenido:

```js
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('Book', BookSchema);
```

Explicacion linea por linea:

```js
const mongoose = require('mongoose');
```

Importa Mongoose para poder crear un esquema y un modelo.

```js
const BookSchema = new mongoose.Schema({
```

Crea un esquema. Un esquema define que campos tendra un documento.

```js
title: { type: String, required: true }
```

El campo `title` debe ser texto y es obligatorio.

```js
description: { type: String }
```

El campo `description` debe ser texto, pero no es obligatorio.

```js
module.exports = mongoose.model('Book', BookSchema);
```

Exporta el modelo `Book`. Gracias a este modelo podemos hacer operaciones como:

- `Book.find()`
- `book.save()`
- `Book.updateOne()`
- `Book.deleteOne()`

Mongoose normalmente crea la coleccion en plural y minusculas. El modelo `Book` suele guardarse en una coleccion llamada `books`.

## Rutas del proyecto

Las rutas estan en:

```text
routes/books.js
```

Este archivo define que puede hacer la API con los libros.

Primero se importa Express y se crea un router:

```js
const express = require('express');
const router = express.Router();
```

Un router sirve para separar rutas en archivos diferentes. Esto ayuda a que el proyecto no tenga todo mezclado en `app.js`.

Luego se importa el modelo:

```js
const Book = require('../models/book');
```

Esto permite usar la coleccion de libros desde las rutas.

## Endpoints de la API

Un endpoint es una URL especifica de la API que realiza una accion.

La ruta base es:

```text
http://localhost:4000/api/books
```

### 1. Obtener todos los libros

Metodo:

```text
GET
```

URL:

```text
http://localhost:4000/api/books
```

Codigo:

```js
router.get('/', (req, res) => {
  Book.find()
    .then(books => {
      res.json(books);
    })
    .catch(err => {
      res.status(400).json('Error: ' + err);
    });
});
```

Explicacion:

- `router.get('/')` indica que esta ruta responde a peticiones GET.
- `Book.find()` busca todos los libros en MongoDB.
- `.then(books => ...)` se ejecuta si la consulta funciona.
- `res.json(books)` responde al cliente con los libros en formato JSON.
- `.catch(err => ...)` se ejecuta si ocurre un error.

Respuesta esperada:

```json
[
  {
    "_id": "665...",
    "title": "El Principito",
    "description": "Libro corto"
  }
]
```

### 2. Crear un libro

Metodo:

```text
POST
```

URL:

```text
http://localhost:4000/api/books
```

Cuerpo JSON:

```json
{
  "title": "El Principito",
  "description": "Libro corto sobre amistad"
}
```

Codigo:

```js
router.post('/', (req, res) => {
  const book = new Book({
    title: req.body.title,
    description: req.body.description
  });

  book.save()
    .then(data => {
      res.json(data);
    })
    .catch(e => {
      res.json({ message: e.message });
    });
});
```

Explicacion:

- `router.post('/')` recibe datos para crear un nuevo recurso.
- `req.body.title` obtiene el titulo enviado por el cliente.
- `req.body.description` obtiene la descripcion enviada por el cliente.
- `new Book(...)` crea un nuevo documento usando el modelo.
- `book.save()` guarda el libro en MongoDB.
- `res.json(data)` devuelve el libro guardado.

### 3. Actualizar la descripcion de un libro

Metodo:

```text
PATCH
```

URL:

```text
http://localhost:4000/api/books/ID_DEL_LIBRO
```

Ejemplo:

```text
http://localhost:4000/api/books/665f1a2b3c4d5e6f78901234
```

Cuerpo JSON:

```json
{
  "description": "Nueva descripcion del libro"
}
```

Codigo:

```js
router.patch('/:id', (req, res) => {
  Book.updateOne(
    { _id: req.params.id },
    { $set: { description: req.body.description } }
  )
    .then(data => {
      res.json(data);
    })
    .catch(e => {
      res.json({ message: e.message });
    });
});
```

Explicacion:

- `/:id` indica que la URL recibe un parametro llamado `id`.
- `req.params.id` obtiene el ID que viene en la URL.
- `Book.updateOne(...)` actualiza un documento.
- `{ _id: req.params.id }` busca el libro por su identificador.
- `$set` indica que se va a modificar un campo.
- En este proyecto solo se actualiza `description`.

Respuesta comun de MongoDB:

```json
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```

Significado:

- `acknowledged`: MongoDB recibio la operacion.
- `matchedCount`: cuantos documentos encontro.
- `modifiedCount`: cuantos documentos modifico.

### 4. Eliminar un libro

Metodo:

```text
DELETE
```

URL:

```text
http://localhost:4000/api/books/ID_DEL_LIBRO
```

Codigo:

```js
router.delete('/:id', (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(data => {
      res.json(data);
    })
    .catch(e => {
      res.json({ message: e.message });
    });
});
```

Explicacion:

- `router.delete('/:id')` recibe una peticion para eliminar.
- `req.params.id` obtiene el ID de la URL.
- `Book.deleteOne(...)` elimina un documento que coincida con ese ID.
- `res.json(data)` devuelve el resultado de la operacion.

Respuesta comun:

```json
{
  "acknowledged": true,
  "deletedCount": 1
}
```

## Flujo completo de una peticion

Ejemplo: crear un libro.

1. El cliente manda una peticion `POST` a `http://localhost:4000/api/books`.
2. Express recibe la peticion en `app.js`.
3. `bodyParser.json()` convierte el JSON enviado en `req.body`.
4. `app.use('/api/books', boooks)` manda la peticion al archivo `routes/books.js`.
5. La ruta `router.post('/')` crea un nuevo objeto `Book`.
6. Mongoose usa el modelo de `models/book.js`.
7. `book.save()` guarda el documento en MongoDB.
8. MongoDB responde a Mongoose.
9. Express responde al cliente con `res.json(data)`.

## Como ejecutar el proyecto

Primero se instalan dependencias:

```bash
npm install
```

Despues se puede ejecutar en modo normal:

```bash
npm start
```

O en modo desarrollo:

```bash
npm run dev
```

La diferencia es:

- `npm start` ejecuta `node app.js`.
- `npm run dev` ejecuta `nodemon app.js`.

`nodemon` reinicia el servidor automaticamente cuando guardas cambios.

Si todo sale bien, la consola debe mostrar:

```text
MongoDB connected
```

El servidor queda disponible en:

```text
http://localhost:4000
```

## Como probar la API

Puedes usar Postman, Thunder Client, Insomnia o cualquier cliente HTTP.

### Probar GET

Metodo:

```text
GET
```

URL:

```text
http://localhost:4000/api/books
```

No necesita body.

### Probar POST

Metodo:

```text
POST
```

URL:

```text
http://localhost:4000/api/books
```

Headers:

```text
Content-Type: application/json
```

Body:

```json
{
  "title": "Node para principiantes",
  "description": "Introduccion a servidores con Express"
}
```

### Probar PATCH

Metodo:

```text
PATCH
```

URL:

```text
http://localhost:4000/api/books/ID_DEL_LIBRO
```

Body:

```json
{
  "description": "Descripcion actualizada"
}
```

### Probar DELETE

Metodo:

```text
DELETE
```

URL:

```text
http://localhost:4000/api/books/ID_DEL_LIBRO
```

No necesita body.

## Como crear este proyecto desde cero

### 1. Crear la carpeta

```bash
mkdir MyApiWithMongodb
cd MyApiWithMongodb
```

### 2. Inicializar Node.js

```bash
npm init -y
```

Esto crea el archivo `package.json`.

### 3. Instalar dependencias

```bash
npm install express mongoose cors body-parser nodemon
```

Significado:

- `express`: crear servidor y rutas.
- `mongoose`: conectar y trabajar con MongoDB.
- `cors`: permitir peticiones desde otras aplicaciones.
- `body-parser`: leer cuerpos JSON.
- `nodemon`: reiniciar servidor automaticamente en desarrollo.

### 4. Crear estructura de carpetas

```text
models/
routes/
app.js
```

### 5. Crear el modelo

Archivo:

```text
models/book.js
```

Codigo:

```js
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('Book', BookSchema);
```

### 6. Crear las rutas

Archivo:

```text
routes/books.js
```

Codigo base:

```js
const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/', (req, res) => {
  Book.find()
    .then(books => res.json(books))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/', (req, res) => {
  const book = new Book({
    title: req.body.title,
    description: req.body.description
  });

  book.save()
    .then(data => res.json(data))
    .catch(e => res.json({ message: e.message }));
});

router.patch('/:id', (req, res) => {
  Book.updateOne(
    { _id: req.params.id },
    { $set: { description: req.body.description } }
  )
    .then(data => res.json(data))
    .catch(e => res.json({ message: e.message }));
});

router.delete('/:id', (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(data => res.json(data))
    .catch(e => res.json({ message: e.message }));
});

module.exports = router;
```

### 7. Crear el servidor

Archivo:

```text
app.js
```

Codigo:

```js
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const books = require('./routes/books');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/books', books);

mongoose.connect('TU_CADENA_DE_CONEXION_DE_MONGODB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Failed to connect to MongoDB: ' + err));

app.listen(4000);
```

Nota: en el proyecto actual la variable se llama `boooks`, con tres letras `o`. Funciona porque se usa igual en el `require` y en `app.use`, pero lo ideal seria llamarla `books` para que sea mas claro.

### 8. Configurar scripts

En `package.json`:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

### 9. Ejecutar

```bash
npm run dev
```

## Conceptos clave para memorizar

### API

Una API es una forma de comunicacion entre programas. En este proyecto, el cliente se comunica con el servidor usando HTTP.

### Servidor

Es el programa que espera peticiones y responde. Aqui el servidor es Express ejecutandose con Node.js.

### Cliente

Es quien manda la peticion. Puede ser Postman, Thunder Client, una pagina web, una app movil, etc.

### HTTP

Es el protocolo usado para comunicarse en la web.

Metodos importantes:

- `GET`: obtener datos.
- `POST`: crear datos.
- `PATCH`: actualizar parte de un dato.
- `DELETE`: eliminar datos.

### Request y response

En Express:

- `req` significa request, o sea, la peticion que llega.
- `res` significa response, o sea, la respuesta que se envia.

Ejemplos:

```js
req.body
```

Datos enviados en el cuerpo de la peticion.

```js
req.params.id
```

Dato enviado en la URL.

```js
res.json(...)
```

Respuesta en formato JSON.

### JSON

JSON es un formato de datos muy usado en APIs.

Ejemplo:

```json
{
  "title": "Libro",
  "description": "Descripcion"
}
```

### Middleware

Un middleware es una funcion que Express ejecuta antes de llegar a la ruta final.

Ejemplos en este proyecto:

```js
app.use(cors());
app.use(bodyParser.json());
app.use('/api/books', boooks);
```

### Schema

Un schema define la estructura de los documentos en MongoDB.

En este proyecto:

```js
title: { type: String, required: true }
description: { type: String }
```

### Model

Un model es una herramienta creada a partir del schema. Sirve para consultar, crear, actualizar y eliminar documentos.

Ejemplo:

```js
const Book = require('../models/book');
```

### Promesas

Muchas operaciones con base de datos tardan un poco. Por eso Mongoose devuelve promesas.

```js
Book.find()
  .then(...)
  .catch(...);
```

Significado:

- `.then(...)`: se ejecuta si todo salio bien.
- `.catch(...)`: se ejecuta si ocurrio un error.

## Preguntas tipo examen

### Que hace `app.listen(4000)`?

Inicia el servidor en el puerto `4000`.

### Que hace `app.use('/api/books', boooks)`?

Le dice a Express que las rutas del archivo `routes/books.js` se usaran con el prefijo `/api/books`.

### Para que sirve Mongoose?

Sirve para conectar Node.js con MongoDB y trabajar con modelos y esquemas.

### Que hace `Book.find()`?

Busca todos los documentos de libros en la base de datos.

### Que hace `book.save()`?

Guarda un nuevo libro en MongoDB.

### Que hace `Book.updateOne()`?

Actualiza un documento que coincida con una condicion.

### Que hace `Book.deleteOne()`?

Elimina un documento que coincida con una condicion.

### De donde sale `req.body.title`?

Sale del JSON que el cliente envia en el cuerpo de la peticion.

### De donde sale `req.params.id`?

Sale de la URL cuando la ruta tiene `/:id`.

### Que pasa si no envio `title` al crear un libro?

Como el modelo dice `required: true`, Mongoose genera un error de validacion.

## Recomendaciones importantes

La cadena de conexion de MongoDB contiene usuario y contrasena. En un proyecto real no debe escribirse directamente en `app.js` ni subirse a internet.

Lo recomendado es usar variables de entorno con un archivo `.env`, por ejemplo:

```text
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/base
```

Y en el codigo:

```js
mongoose.connect(process.env.MONGO_URI);
```

Para eso normalmente se instala:

```bash
npm install dotenv
```

Y se agrega al inicio de `app.js`:

```js
require('dotenv').config();
```

## Resumen rapido para antes del examen

Este proyecto es una API REST hecha con Node.js y Express. Se conecta a MongoDB usando Mongoose. Tiene un modelo llamado `Book`, que define libros con `title` y `description`. Las rutas estan en `routes/books.js` y permiten hacer CRUD:

- `GET /api/books`: consulta todos los libros.
- `POST /api/books`: crea un libro.
- `PATCH /api/books/:id`: actualiza la descripcion de un libro.
- `DELETE /api/books/:id`: elimina un libro.

El archivo `app.js` une todo: crea el servidor, activa middlewares, conecta las rutas, conecta MongoDB y escucha en el puerto `4000`.

Para explicar el proyecto en voz alta:

"Mi proyecto es una API REST de libros hecha con Node.js, Express y MongoDB. Express se encarga del servidor y las rutas. Mongoose se encarga de conectar con MongoDB y definir el modelo Book. El modelo Book tiene titulo obligatorio y descripcion opcional. La API tiene endpoints para listar, crear, actualizar y eliminar libros. El servidor se ejecuta en el puerto 4000 y las rutas principales empiezan con `/api/books`."
#   P r o y e c t o 3 e r P a r c i a l M o v M o n g  
 