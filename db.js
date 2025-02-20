const mysql = require('mysql2');
require('dotenv').config();

console.log(process.env);  // Para asegurarte de que las variables se cargan correctamente

// Crear conexión con la base de datos
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Conectar a MySQL
connection.connect(error => {
  if (error) {
    console.error('Error conectando a la base de datos:', error);
    return;
  }
  console.log('Conexión a la base de datos MySQL establecida.');
});

module.exports = connection;
