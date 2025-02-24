// Importar dependencias
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();

// Configuración de la aplicación
const app = express();
const port = 3000;

// Configurar middleware
app.use(cors());
app.use(express.json());

// Validación simple de datos
function validarDatosEquipo(equipo) {
  if (!equipo.nombre || !equipo.entrenador || !equipo.email || !equipo.telefono || !equipo.categoria || !Array.isArray(equipo.jugadores)) {
    return false;
  }
  return true;
}
// Conectar a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'torneos'
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Rutas para manejar equipos de fútbol

// Crear un nuevo equipo
app.post('/equipo', (req, res) => {
  const { nombre, entrenador, email, telefono, categoria, jugadores } = req.body;

  if (!validarDatosEquipo(req.body)) {
    return res.status(400).json({ error: 'Datos del equipo incompletos o inválidos' });
  }

  // Insertar el equipo en la tabla equipos_futbol
  const query = 'INSERT INTO equipos_futbol (nombre, entrenador, email, telefono, categoria, jugadores) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [nombre, entrenador, email, telefono, categoria, JSON.stringify(jugadores)];

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

    if (results.length === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

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

// Rutas para manejar nadadores de natación

// Registrar un nadador
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

// Obtener la lista de equipos de natación
app.get('/equipos-natacion', (req, res) => {
  const query = 'SELECT DISTINCT equipo FROM nadadores_natacion';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener equipos de natación:', err);
      return res.status(500).json({ error: 'Error al obtener equipos' });
    }
    res.status(200).json(results);
  });
});

// Obtener nadadores de un equipo específico
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

// Eliminar un nadador
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

// Actualizar un nadador
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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
