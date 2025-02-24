// server.js (Backend Node.js + Express)
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'torneos_futbol'
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Endpoint para registrar un nadador
app.post('/nadadores', (req, res) => {
  const { equipo, nombre, dni, sexo, estilo, prueba } = req.body;

  if (!equipo || !nombre || !dni || !sexo || !estilo || !prueba) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = 'INSERT INTO nadadores_natacion (equipo, nombre, dni, sexo, estilo, prueba) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [equipo, nombre, dni, sexo, estilo, prueba];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al registrar el nadador:', err);
      return res.status(500).json({ error: 'Error al registrar el nadador' });
    }
    return res.status(201).json({ message: 'Nadador registrado correctamente' });
  });
});

// Endpoint para obtener la lista de equipos de natación
app.get('/equipos-natacion', (req, res) => {
  const query = 'SELECT DISTINCT equipo FROM nadadores_natacion'; // Cambié el nombre de la tabla
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener equipos de natación:', err);
      return res.status(500).json({ error: 'Error al obtener equipos' });
    }
    return res.json(results);
  });
});

// Endpoint para obtener nadadores de un equipo específico
app.get('/nadadores-por-equipo', (req, res) => {
  const { equipo } = req.query;
  if (!equipo) {
    return res.status(400).json({ error: 'El equipo es obligatorio' });
  }
  const query = 'SELECT * FROM nadadores_natacion WHERE equipo = ?';
  db.query(query, [equipo], (err, results) => {
    if (err) {
      console.error('Error al obtener nadadores:', err);
      return res.status(500).json({ error: 'Error al obtener nadadores' });
    }
    return res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
// Endpoint para eliminar un nadador
app.delete('/nadadores/:id', (req, res) => {
  const nadadorId = req.params.id;

  const query = 'DELETE FROM nadadores_natacion WHERE id = ?';
  db.query(query, [nadadorId], (err, result) => {
    if (err) {
      console.error('Error al eliminar el nadador:', err);
      return res.status(500).json({ error: 'Error al eliminar el nadador' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nadador no encontrado' });
    }
    return res.status(200).json({ message: 'Nadador eliminado correctamente' });
  });
});

// Endpoint para actualizar un nadador
app.put('/nadadores/:id', (req, res) => {
  const nadadorId = req.params.id;
  const { nombre, dni, sexo, estilo, prueba } = req.body;

  const query = `
    UPDATE nadadores_natacion 
    SET nombre = ?, dni = ?, sexo = ?, estilo = ?, prueba = ? 
    WHERE id = ?
  `;
  const values = [nombre, dni, sexo, estilo, prueba, nadadorId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar el nadador:', err);
      return res.status(500).json({ error: 'Error al actualizar el nadador' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nadador no encontrado' });
    }
    return res.status(200).json({ message: 'Nadador actualizado correctamente' });
  });
});