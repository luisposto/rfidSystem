// db.js
const mysql = require('mysql2');

// Crea la conexión: actualiza los datos (host, usuario, contraseña, base de datos) según tu entorno.
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Belgrano#01',
  database: 'rfid_db'
});

connection.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos SQL');
});

module.exports = connection;
