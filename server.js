// Importar dependencias
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const db = require('./db');  // Importamos la conexión a la base de datos
require('dotenv').config();

// Middleware para habilitar CORS
app.use(cors());
const mysql = require('mysql');
require('dotenv').config();

// Configuración de la aplicación
const app = express();
const port = 3000;

// Configurar middleware
app.use(cors());
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

// Conectar a la base de datos
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

// Rutas para manejar equipos de fútbol

// Crear un nuevo equipo
app.post('/equipo', (req, res) => {
  const { nombre, entrenador, email, telefono, categoria, jugadores } = req.body;

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

    if (results.length > 0) {
      const jugadores = results[0].jugadores; // Debería ser un array de strings
      return res.status(200).json(jugadores);
    } else {
    if (results.length === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    results[0].jugadores = JSON.parse(results[0].jugadores);
    res.status(200).json(results[0]);
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
