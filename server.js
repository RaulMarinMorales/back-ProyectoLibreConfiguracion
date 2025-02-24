const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const db = require('./db');  // Importamos la conexión a la base de datos
require('dotenv').config();

// Middleware para habilitar CORS
app.use(cors());

// Middleware para log de las solicitudes
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  console.log('Cuerpo:', req.body);
  next();
});

// Middleware para parsear JSON
app.use(express.json());

// Ruta para inscribir equipo 3x3
app.post('/api/inscribir3x3', (req, res) => {
  const { nombre_equipo, localidad, direccion, capitan, jugadores } = req.body;

  // Validar que los campos requeridos están presentes
  if (!nombre_equipo || !localidad || !direccion || !capitan || !jugadores || jugadores.length !== 3) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios y deben haber 3 jugadores' });
  }

  const jugadoresArray = jugadores; // Ya es un array de strings

  const query = 'INSERT INTO equipos_baloncesto (nombre_equipo, localidad, direccion, capitan, modalidad, jugadores) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [nombre_equipo, localidad, direccion, capitan, '3x3', jugadoresArray];
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al registrar el equipo 3x3:', err);
      return res.status(500).json({ error: 'Error al registrar el equipo' });
    }

    return res.status(201).json({ message: 'Equipo 3x3 registrado correctamente', equipoId: result.insertId });
  });
});

// Ruta para inscribir equipo 5x5
app.post('/api/inscribir5x5', (req, res) => {
  const { nombre_equipo, localidad, direccion, capitan, jugadores } = req.body;

  if (!nombre_equipo || !localidad || !direccion || !capitan || !jugadores || jugadores.length !== 5) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios y deben haber 5 jugadores' });
  }

  const jugadoresArray = jugadores; // Ya es un array de strings

  const query = 'INSERT INTO equipos_baloncesto (nombre_equipo, localidad, direccion, capitan, modalidad, jugadores) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [nombre_equipo, localidad, direccion, capitan, '3x3', jugadoresArray];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al registrar el equipo 5x5:', err);
      return res.status(500).json({ error: 'Error al registrar el equipo' });
    }

    return res.status(201).json({ message: 'Equipo 5x5 registrado correctamente', equipoId: result.insertId });
  });
});

// Ruta para obtener todos los equipos
// Ruta para obtener todos los equipos
app.get('/api/equipos', (req, res) => {
  const query = 'SELECT * FROM equipos_baloncesto';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener equipos:', err);
      return res.status(500).json({ error: 'Error al obtener equipos' });
    }

    // Asegurarse de que los jugadores sean un array
    results.forEach((equipo) => {
      if (equipo.jugadores) {
        equipo.jugadores = JSON.parse(equipo.jugadores);  // Parsear el JSON para convertirlo en un array
      }
    });

    return res.status(200).json(results);
  });
});



// Ruta para obtener los jugadores de un equipo
app.get('/api/equipo/:id/jugadores', (req, res) => {
  const equipoId = req.params.id;
  const query = 'SELECT jugadores FROM equipos_baloncesto WHERE id = ?';

  db.query(query, [equipoId], (err, results) => {
    if (err) {
      console.error('Error al obtener jugadores:', err);
      return res.status(500).json({ error: 'Error al obtener jugadores' });
    }

    if (results.length > 0) {
      const jugadores = results[0].jugadores; // Debería ser un array de strings
      return res.status(200).json(jugadores);
    } else {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
  });
});

// Ruta para eliminar un equipo
app.delete('/api/equipos/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM equipos_baloncesto WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el equipo:', err);
      return res.status(500).json({ error: 'Error al eliminar el equipo' });
    }

    if (result.affectedRows > 0) {
      return res.status(204).send();
    } else {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
  });
});

// Arrancar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
