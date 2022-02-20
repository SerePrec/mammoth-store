# Segunda entrega proyecto final

Este entrega forma parte del trabajo final correspondiente al curso de **Programación Backend** dictado por **CoderHouse**.  
Se trata del desarrollo de una tienda virtual para una bicicletería (Mammoth).

Por un lado se encuentra el desarrollo de la api REST FULL del ecommerce y por otro unas vistas de frontend para poder probar la funcionalidad de la api.
Estas vistas son provisorias en esta entrega e irán cambiando a lo largo del curso adaptándose a la funcionalidad final.

Esta segunda entrega cuenta con la misma funcionalidad que la primera, pero con dos cambios principales:

- 8 modos de persistencia de datos configurables en el arranque del servidor
- Nuevas funcionalidades y rediseño del chat

### Deploy en Heroku (Temporal):

https://entrega2-prellezose.herokuapp.com

## Ejecución

Luego de clonar o descargar el repositorio e instalar todas las dependencias con `npm install`, existen dos comandos para levantar el proyecto.
Para levantarlo en "modo de desarrollo" junto a nodemon, utilizar `npm run dev`. De lo contrario, para ejecutarlo en "modo producción", utilizar `npm start`.

El servidor permite seleccionar entre 8 diferentes modos de persistencia de datos (ver más abajo en **Selección del modo de persistencia de datos**), a través de la variable de entorno `PERS`. También se le puede pasar el tipo de entrono de ejecución a través de la variable de entorno `NODE_ENV`. En modo `NODE_ENV=production`, no carga el modulo **dotenv**, necesitando configurar las variables de entorno desde la plataforma del servidor donde este alojado el deploy. A continuación se muestra un ejemplo (linux) de ejecución en modo **desarrollo** y persistencia **MariaDB**:

```sh
$ PERS=mariadb npm run dev
```

Por último un ejemplo de configuración del scrip `start` del `package.json` para el deploy que utilicé en **Heroku**

```json
{
  ...
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "start": "NODE_ENV=production PERS=mongodb_atlas node src/.",
    ...
  }
  ...
}
```

## Información general

### Selección del modo de persistencia de datos

A diferencia de la primer entrega en donde la persistencia de los datos relacionados a los **productos, carritos de compra y mensajes** se realizaba en el sistema de archivos, en esta entrega existen 8 modos diferentes para elegir el modo de **peristencia**:

| Key             | Descripción                                               |
| --------------- | --------------------------------------------------------- |
| `mem`           | Persistencia en memoria del servidor (Opción por defecto) |
| `fs`            | Persistencia usando el sistema de archivos                |
| `mariadb`       | Peristencia en base de datos MariaDB local                |
| `cleardb`       | Persitencia en base de datos MySQL de ClearDB (Heroku)    |
| `sqlite3`       | Persitencia en base de datos Sqlite3                      |
| `mongodb`       | Persistencia en base de datos MongoDB local               |
| `mongodb_atlas` | Persistencia en base de datos MongoDB Atlas               |
| `firebase`      | Persistencia en base de datos Firestore (Firebase)        |

Esta selección se hace pasando el valor correspondiente de la key en la variable de entorno `PERS` a la hora de levantar el servidor.
La forma de hacerlo depende de la terminal que se esté ejecutando. Un ejemplo desde linux sería:

```sh
$ PERS=firebase node .
```

**NOTA**: Las credenciales y valores de configuración de las bases de datos se encuentran en el archivo `config.js` y se toman desde variables de entorno.
El archivo `.env` con dichos valores será enviado de manera privada al tutor o profesor encargado de la corrección.

### Vistas

Hay 5 vistas servidas desde el servidor que proveen una manera amena de probar la API REST.
Estas vistas se encuentran en las rutas:

- **/productos** : sería el panel de administrador, donde está el listado de productos y puedo ver, modificar, crear, y borrar productos. Filtrando la búsqueda por distintas maneras. **Solo puede acceder a esta vista un usuario con permisos de aministrador**.

- **/carritos** : es donde simulo el funcionamiento de los carritos. No va a quedar así para el final porque el manejo como está hecho no es para un consumidor. Es más para probar ahora las funciones de la api. Se pueden crear carritos, borrarlos, recorrer distintos carritos, agregar productos con las cantidades deseadas y borrar por completo un producto del carrito o modificar su cantidad desde el mismo. También tiene todo el tema de filtrado y búsqueda de productos útil para el usuario.

- **/chat** : es el chat general en donde cada usuario puede escribir su consulta y ver las respuestas del administrador/empresa (**Mammoth Bike Store**) junto a las demas consultas de los usuarios. Utiliza **websockets**.

- **/chat/:email** : en esta vista se muestran solamente los mensajes del usuario seleccionado por su **email**, y las respuestas de la empresa hacia el mismo. Utiliza **websockets**.

- **/chat-admin** : esta vista es el panel de administrador del chat. En ella el administrador/empresa puede enviar:

  - mensajes generales (selección nula de destinatario).
  - mensajes a un determinado usuario (seleccionando el mismo haciendo click sobre alguno de sus mensajes o introduciendo su email manualmente)
  - mensajes respuestas a determinados mensajes puntuales, haciendo click sobre el botón que aparece a la derecha de cada mensaje al que se le hace hover. En este caso la respuesta cita el mensaje de origen.

  Utiliza **websockets**. **Solo puede acceder a esta vista un usuario con permisos de aministrador**.

### API

Independientemente del modo de persistencia elegido, cada endpoint devuelve el mismo formato de datos.

Consiste en las siguientes rutas:

#### Router /api/productos

| Método | Endpoint                | Descripción                                                                                                            |
| ------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| GET    | **/api/productos/:id?** | Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores) |
| POST   | **/api/productos/**     | Para incorporar productos al listado (disponible para administradores)                                                 |
| PUT    | **/api/productos/:id**  | Actualiza un producto por su id. Admite actualizaciones parciales (disponible para administradores)                    |
| DELETE | **/api/productos/:id**  | Borra un producto por su id (disponible para administradores)                                                          |

#### Router /api/carrito

| Método | Endpoint                                | Descripción                                                                                                                      |
| ------ | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| GET    | **/api/carrito/**                       | Obtengo el listado de ids de los carritos existentes                                                                             |
| POST   | **/api/carrito/**                       | Crea un carrito y devuelve su id                                                                                                 |
| DELETE | **/api/carrito/:id**                    | Vacía un carrito y lo elimina por si id                                                                                          |
| GET    | **/api/carrito/:id/productos**          | Me permite listar todos los productos guardados en el carrito con determinado id                                                 |
| POST   | **/api/carrito/:id/productos**          | Para incorporar productos al carrito por su id de carrito y el id de producto y cantidad (en el cuerpo de la petición)           |
| PUT    | **/api/carrito/:id/productos**          | Para actualizar un producto del carrito por su id de carrito y los datos a actualizar del producto (en el cuerpo de la petición) |
| DELETE | **/api/carrito/:id/productos/:id_prod** | Eliminar un producto del carrito por su id de carrito y de producto                                                              |

### Algunos comentarios

Cada clase "Contenedor" asociada al tipo de persistencia posee los mismos métodos para poder independizarlas del resto de la lógica propia de la API.  
Estos métodos están estructurados para devolver el mismo formato de datos y contemplar los mismos tipos de respuestas en todos los casos. Así no se generan riesgos de romper el código por manejar respuestas diferentes entre estos casos.

Respecto a la API, pongo validaciones extras como middlewares para justamente verificar que los datos que llegan estén dentro de lo esperado, y sino devuelvo algún tipo de mensaje de error. También hago validaciones dentro de la función principal para considerar distintos casos y no bloquear el servidor ante un error.

El tema de la autenticación, por ahora lo dejé como piden con una variable booleana, porque lo hago bien cuando sepa como es. Por eso no generé ningún login en el front. Para probar, solo cambio el valor de la variable en el back, cosa que después se seteará de acuerdo a lo que llegue del front.

Los productos tienen los campos que piden más un par extras que yo voy a utilizar en el final. Como por ejemplo la categoría que es muy importante.

Pusé la posibilidad de subir una imagen desde el formulario. Entonces puedo elegir entre colocar una url para el thumbnail, o tomar una imagen existente y asociar su ruta desde la carpeta en donde se sube. Si subo el archivo le da prioridad a esta ruta, por más que haya colocado una url a mano.

También el carrito tiene de base el formato que piden, pero le agregué otro campo fundamental como es la cantidad por producto. No me gusta que se vayan repitiendo si agrego más del mismo

Agregué una ruta extra de carrito que sirve para actualizar los productos. Ya que aparte de agregar y borrar productos del carrito de manera completa, también quiero poder subir o bajar la cantidad del mismo desde el carrito, es decir, modificar su cantidad a otro valor dentro del rango permitido. Aparte hay una ruta extra también que me devuelve todos los ids de los carritos existentes, que uso para generar un listado de ellos en el front.

También antes de agregar o modificar productos del carrito, valido el stock actual y solo permito la acción, si la cantidad en el carrito va a ser menor o igual al stock. Sino muestro un mensaje de error indicando el problema y notificando el stock del producto.

### Videos demo

- [Administrando productos](https://drive.google.com/file/d/1Doq09PCSIOYAJkUAQB6Nx3eRucIqIazm/view)

- [Manejando carritos](https://drive.google.com/file/d/12nTy6DGwEsbV7JIcJZzSCrtHCKq-Ltfu/view)

- [Chat - Administrador y 2 usuarios](https://drive.google.com/file/d/1xjfIOB7aln4uUZBxEzTEFZzIS4Fw3Oca/view)

- [Chat - Historial de mensajes individuales](https://drive.google.com/file/d/17KBsQwGtI8zABUeAPJxYxZ4i61Y2Y5IJ/view)

///////////// A INCORPORAR

Normalización: Analicé la normalización para la transmisión de los mensajes, pero para la estructura de datos que tengo en este caso, no resulta conveniente la normalización. Por lo contrario, se obtienen datos con mayor volumen que el original.
Esto se debe a que no existe una redudndncia de infomación en la data que haga necesario la normalización, ni tampoco infomación profundamente anidada. diferente era el caso del desafío ..... donde se guardaba más infomación en los mensajes y había mucha redundancia de la misma, lo que hacía ventajoso el uso de la normalización para bajar la cantidad de datos transmitidos.

OWASP. Escape html en endpoints y entradas de usuarios
