const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const db = require('./db');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Validación simple de datos
function validarDatosEquipo(equipo) {
  if (!equipo.nombre || !equipo.entrenador || !equipo.email || !equipo.telefono || !equipo.categoria || !Array.isArray(equipo.jugadores)) {
    return false;
  }
  return true;
}

// Crear un nuevo equipo
app.post('/equipo', (req, res) => {
  const { nombre, entrenador, email, telefono, categoria, jugadores } = req.body;

  if (!validarDatosEquipo(req.body)) {
    return res.status(400).json({ error: 'Datos del equipo incompletos o inválidos' });
  }

  // Insertar el equipo en la tabla equipos_futbol
  const query = 'INSERT INTO equipos_futbol (nombre, entrenador, email, telefono, categoria, jugadores) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [nombre, entrenador, email, telefono, categoria, JSON.stringify(jugadores)]; // Convertir la lista de jugadores a JSON

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al crear equipo:', err);
      return res.status(500).json({ error: 'Error al crear equipo' });
    }
    res.status(201).json({
      message: 'Equipo creado correctamente',
      id: result.insertId
    });
  });
});

// Obtener todos los equipos
app.get('/equipos', (req, res) => {
  const query = 'SELECT * FROM equipos_futbol';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener equipos:', err);
      return res.status(500).json({ error: 'Error al obtener equipos' });
    }
    res.status(200).json(results);
  });
});

// Obtener un equipo por su ID
app.get('/equipo/:id', (req, res) => {
  const equipoId = req.params.id;
  const query = 'SELECT * FROM equipos_futbol WHERE id = ?';
  db.query(query, [equipoId], (err, results) => {
    if (err) {
      console.error('Error al obtener equipo:', err);
      return res.status(500).json({ error: 'Error al obtener equipo' });
    }

    // Si no se encuentra el equipo
    if (results.length === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    // Parsear la columna jugadores de JSON a un array
    results[0].jugadores = JSON.parse(results[0].jugadores);
    res.status(200).json(results[0]);
  });
});

// Eliminar un equipo
app.delete('/equipo/:id', (req, res) => {
  const equipoId = req.params.id;
  const query = 'DELETE FROM equipos_futbol WHERE id = ?';
  db.query(query, [equipoId], (err, result) => {
    if (err) {
      console.error('Error al eliminar equipo:', err);
      return res.status(500).json({ error: 'Error al eliminar equipo' });
    }
    res.status(200).json({ message: 'Equipo eliminado correctamente' });
  });
});

// Editar un equipo
app.put('/equipo/:id', (req, res) => {
  const equipoId = req.params.id;
  const { nombre, entrenador, email, telefono, categoria, jugadores } = req.body;

  if (!validarDatosEquipo(req.body)) {
    return res.status(400).json({ error: 'Datos del equipo incompletos o inválidos' });
  }

  const query = 'UPDATE equipos_futbol SET nombre = ?, entrenador = ?, email = ?, telefono = ?, categoria = ?, jugadores = ? WHERE id = ?';
  const values = [nombre, entrenador, email, telefono, categoria, JSON.stringify(jugadores), equipoId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al editar equipo:', err);
      return res.status(500).json({ error: 'Error al editar equipo' });
    }
    res.status(200).json({ message: 'Equipo actualizado correctamente' });
  });
});

// Ruta para comprobar la conexión al servidor
app.get('/status', (req, res) => {
  res.status(200).json({ message: 'Servidor en funcionamiento' });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
