# RFID System

Este proyecto implementa un sistema de lectura de tags RFID conectado a un puerto serie (p. ej. un lector USB‑RS232) y expone los datos mediante un servidor web en Node.js con Express.

---

## Tabla de contenidos

1. [Descripción](#descripción)
2. [Características](#características)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Requisitos](#requisitos)
5. [Instalación](#instalación)
6. [Configuración](#configuración)
7. [Uso](#uso)
8. [API REST](#api-rest)
9. [Base de datos](#base-de-datos)
10. [Módulo `rfidReader`](#módulo-rfidreader)
11. [Contribuir](#contribuir)
12. [Licencia](#licencia)

---

## Descripción

El sistema lee periódicamente (cada segundo) un UID de un tag RFID desde el puerto serie, lo formatea (hexadecimal y decimal), lo almacena en una base de datos evitando duplicados y lo expone a través de endpoints REST. Además, puede servir contenido estático (frontend) desde la carpeta `public`.

## Características

* Lectura automática cada 1s del lector RFID.
* Evita inserciones duplicadas en la base de datos.
* Conversión de UID a **hexadecimal** y **decimal**.
* Endpoints REST para obtener la última lectura y un histórico de las últimas 30 lecturas.
* Estructura modular con Express, rutas separadas y módulo de lectura.

## Estructura del proyecto

```
├── routes/
│   └── tags.js           # Rutas para CRUD de tags
├── public/               # Frontend estático (HTML/CSS/JS)
├── db.js                 # Conexión y configuración de la base de datos
├── rfidReader.js         # Lector serial y formateo de UID
├── server.js             # Servidor Express principal
├── .env                  # Variables de entorno (no versionar)
└── README.md             # Documentación del proyecto
```

## Requisitos

* **Node.js** (v14+)
* **npm** o **yarn**
* **MySQL** o **MariaDB**
* Lector RFID (con puerto serie asignado, p.ej. COM3 en Windows o `/dev/ttyUSB0` en Linux)
* Archivo de variables de entorno `.env`

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/luisposto/rfidSystem.git
cd rfidSystem

# Instalar dependencias
npm install
```

## Configuración

1. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```ini
   # Conexión a la BD
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASS=tu_contraseña
   DB_NAME=nombre_base_de_datos

   # Puerto serie del lector RFID\ nRF
   RFID_PORT=COM3
   # Opcional: ajustar BAUDRATE si no es 38400
   RFID_BAUDRATE=38400
   ```

2. Asegurarse de crear la base de datos y la tabla `tags`:

   ```sql
   CREATE DATABASE nombre_base_de_datos;
   USE nombre_base_de_datos;

   CREATE TABLE tags (
     id INT AUTO_INCREMENT PRIMARY KEY,
     tag VARCHAR(32) UNIQUE NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## Uso

```bash
# Iniciar el servidor Express
npm start
```

* El servidor escuchará en [http://localhost:3000](http://localhost:3000)
* El frontend (si existe) se sirve automáticamente desde `/public`.

## API REST

* **GET** `/api/ultimo-tag`
  Devuelve la última lectura en bruto:

  ```json
  { "tag": "3000303ACB034289959C8BE02931C994" }
  ```

* **GET** `/api/lecturas`
  Devuelve un arreglo con las últimas 30 lecturas (hex):

  ```json
  { "lecturas": ["HEX1", "HEX2", …] }
  ```

* **Rutas CRUD** en `/api/tags` definidas en `routes/tags.js` (p. ej. POST, GET, DELETE).

## Módulo `rfidReader`

Contiene la lógica de comunicación serial y formateo:

* `formatUid(hexUid)` – Convierte un UID hex a objeto con `{ hex, decimal }`.
* `getUltimoTag()` – Retorna el último UID leído (hex).
* `getLecturas()` – Retorna un array con las últimas 30 lecturas.

Cada tag leído se guarda en la BD mediante la función `guardarTagEnDB`, que evita duplicados.

## Contribuir

1. Hacer fork del repositorio.
2. Crear una rama con tu feature: `git checkout -b feature/mi-feature`.
3. Hacer commits bien descriptivos y push.
4. Abrir un Pull Request describiendo cambios y motivación.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
