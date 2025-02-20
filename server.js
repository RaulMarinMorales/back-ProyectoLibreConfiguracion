const express = require('express');
const cors = require('cors');  // Importamos el paquete CORS
const app = express();
const port = 3000;
const db = require('./db');  // Importamos la conexión a la base de datos
require('dotenv').config();

// Middleware para habilitar CORS
app.use(cors());  // Esto habilita CORS para todas las rutas de tu servidor

// Middleware para log de las solicitudes
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  console.log('Cuerpo:', req.body);
  next();
});

// Middleware para parsear JSON
app.use(express.json());

// Ruta para registrar un equipo
app.post('/equipo', (req, res) => {
  const { nombre, entrenador, email, telefono, categoria, jugadores } = req.body;

  // Validar que los campos requeridos están presentes
  if (!nombre || !entrenador || !email || !telefono || !categoria || !jugadores || jugadores.length === 0) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios, incluyendo jugadores' });
  }

  // Convertimos la lista de jugadores a un formato JSON
  const jugadoresJSON = JSON.stringify(jugadores);

  // SQL para insertar un nuevo equipo
  const query = 'INSERT INTO equipos_futbol (nombre, entrenador, email, telefono, categoria, jugadores) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [nombre, entrenador, email, telefono, categoria, jugadoresJSON];

  // Ejecutamos la consulta para registrar el equipo
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al registrar el equipo:', err);
      return res.status(500).json({ error: 'Error al registrar el equipo' });
    }

    return res.status(201).json({ message: 'Equipo registrado correctamente', equipoId: result.insertId });
  });
});

// Ruta para obtener todos los equipos
app.get('/equipos', (req, res) => {
  const query = 'SELECT * FROM equipos_futbol';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener equipos:', err);
      return res.status(500).json({ error: 'Error al obtener equipos' });
    }
    return res.status(200).json(results);
  });
});

// Ruta para obtener los jugadores de un equipo
app.get('/equipo/:id/jugadores', (req, res) => {
  const equipoId = req.params.id;
  const query = 'SELECT jugadores FROM equipos_futbol WHERE id = ?';

  db.query(query, [equipoId], (err, results) => {
    if (err) {
      console.error('Error al obtener jugadores:', err);
      return res.status(500).json({ error: 'Error al obtener jugadores' });
    }

    if (results.length > 0) {
      const jugadores = JSON.parse(results[0].jugadores);
      return res.status(200).json(jugadores);
    } else {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
  });
});

// Arrancar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
