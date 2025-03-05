// Importar dependencias
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();

// Configuración de la aplicación
const app = express();
const port = 3000;

// Configurar middleware
app.use(cors()); // Permite solicitudes desde diferentes dominios
app.use(express.json()); // Permite manejar datos en formato JSON

// Función para validar datos de un equipo de fútbol
function validarDatosEquipo(equipo) {
  return (
    equipo.nombre &&
    equipo.entrenador &&
    equipo.email &&
    equipo.telefono &&
    equipo.categoria &&
    Array.isArray(equipo.jugadores) &&
    equipo.jugadores.length > 0
  );
}

// Función para validar datos de inscripción en baloncesto
function validarDatosBaloncesto(equipo) {
  return equipo.nombre_equipo && equipo.capitan && Array.isArray(equipo.jugadores) && equipo.jugadores.length > 0;
}

// Conectar a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'torneos' // Verifica el nombre correcto de tu base de datos
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Rutas para equipos de fútbol

// Crear un equipo de fútbol
app.post('/equipo', (req, res) => {
  if (!validarDatosEquipo(req.body)) {
    return res.status(400).json({ error: 'Datos del equipo incompletos o inválidos' });
  }

  const { nombre, entrenador, email, telefono, categoria, jugadores } = req.body;
  const query = 'INSERT INTO equipos_futbol (nombre, entrenador, email, telefono, categoria, jugadores) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [nombre, entrenador, email, telefono, categoria, JSON.stringify(jugadores)];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al crear equipo:', err);
      return res.status(500).json({ error: 'Error al crear equipo' });
    }
    res.status(201).json({ message: 'Equipo creado correctamente', id: result.insertId });
  });
});

// Obtener todos los equipos de fútbol
app.get('/equipos', (req, res) => {
  db.query('SELECT * FROM equipos_futbol', (err, results) => {
    if (err) {
      console.error('Error al obtener equipos:', err);
      return res.status(500).json({ error: 'Error al obtener equipos' });
    }
    res.status(200).json(results);
  });
});

// Obtener un equipo de fútbol por ID
app.get('/equipo/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM equipos_futbol WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al obtener equipo:', err);
      return res.status(500).json({ error: 'Error al obtener equipo' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    res.status(200).json(results[0]); // Devuelve el primer resultado (el equipo)
  });
});

// Ruta para eliminar un equipo de fútbol
app.delete('/equipo/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM equipos_futbol WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el equipo:', err);
      return res.status(500).json({ error: 'Error al eliminar el equipo' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    res.status(200).json({ message: 'Equipo eliminado correctamente' });
  });
});

// Ruta para editar un equipo de fútbol
app.put('/equipo/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, entrenador, email, telefono, categoria, jugadores } = req.body;

  // Asegurarse de que los campos necesarios están presentes
  if (!nombre || !entrenador || !email || !telefono || !categoria || !jugadores) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  // Validar que jugadores sea un array
  let jugadoresJSON = [];
  try {
    jugadoresJSON = Array.isArray(jugadores) ? jugadores : JSON.parse(jugadores);
  } catch (err) {
    return res.status(400).json({ error: 'El campo jugadores debe ser un array válido' });
  }

  const query = 'UPDATE equipos_futbol SET nombre = ?, entrenador = ?, email = ?, telefono = ?, categoria = ?, jugadores = ? WHERE id = ?';
  const values = [nombre, entrenador, email, telefono, categoria, JSON.stringify(jugadoresJSON), id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar el equipo:', err);
      return res.status(500).json({ error: 'Error al actualizar el equipo' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    res.status(200).json({ message: 'Equipo actualizado correctamente' });
  });
});

// Rutas para equipos de baloncesto 3x3
app.post('/api/inscribir3x3', (req, res) => {
  if (!validarDatosBaloncesto(req.body)) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  }

  const { nombre_equipo, localidad, direccion, capitan, jugadores } = req.body;
  const query = 'INSERT INTO equipos_baloncesto (nombre_equipo, localidad, direccion, capitan, jugadores) VALUES (?, ?, ?, ?, ?)';
  const values = [nombre_equipo, localidad, direccion, capitan, JSON.stringify(jugadores)];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al inscribir equipo 3x3:', err);
      return res.status(500).json({ error: 'Error al inscribir equipo' });
    }
    res.status(201).json({ message: 'Equipo inscrito en 3x3', id: result.insertId });
  });
});

// Rutas para equipos de baloncesto 5x5
app.post('/api/inscribir5x5', (req, res) => {
  if (!validarDatosBaloncesto(req.body)) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  }

  const { nombre_equipo, localidad, direccion, capitan, jugadores } = req.body;
  const query = 'INSERT INTO equipos_baloncesto (nombre_equipo, localidad, direccion, capitan, jugadores) VALUES (?, ?, ?, ?, ?)';
  const values = [nombre_equipo, localidad, direccion, capitan, JSON.stringify(jugadores)];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al inscribir equipo 5x5:', err);
      return res.status(500).json({ error: 'Error al inscribir equipo' });
    }
    res.status(201).json({ message: 'Equipo inscrito en 5x5', id: result.insertId });
  });
});

// Ruta para obtener equipos de baloncesto
app.get('/api/equipos', (req, res) => {
  db.query('SELECT * FROM equipos_baloncesto', (err, results) => {
    if (err) {
      console.error('Error al obtener equipos de baloncesto:', err);
      return res.status(500).json({ error: 'Error al obtener equipos de baloncesto' });
    }

    // Asegúrate de parsear los jugadores antes de enviarlos al cliente
    results.forEach(equipo => {
      equipo.jugadores = JSON.parse(equipo.jugadores);
    });

    res.status(200).json(results);
  });
});

// Ruta para eliminar un equipo de baloncesto
app.delete('/api/equipos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM equipos_baloncesto WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el equipo:', err);
      return res.status(500).json({ error: 'Error al eliminar el equipo' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    res.status(200).json({ message: 'Equipo eliminado correctamente' });
  });
});

// Rutas para natación
app.post('/nadadores', (req, res) => {
  const { equipo, nombre, dni, sexo, estilo, prueba } = req.body;

  if (!equipo || !nombre || !dni || !sexo || !estilo || !prueba) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = 'INSERT INTO nadadores_natacion (equipo, nombre, dni, sexo, estilo, prueba) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [equipo, nombre, dni, sexo, estilo, prueba], (err) => {
    if (err) {
      console.error('Error al registrar el nadador:', err);
      return res.status(500).json({ error: 'Error al registrar el nadador' });
    }
    res.status(201).json({ message: 'Nadador registrado correctamente' });
  });
});

// Obtener equipos de natación
app.get('/equipos-natacion', (req, res) => {
  db.query('SELECT DISTINCT equipo FROM nadadores_natacion', (err, results) => {
    if (err) {
      console.error('Error al obtener equipos de natación:', err);
      return res.status(500).json({ error: 'Error al obtener equipos' });
    }
    res.status(200).json(results);
  });
});

// Obtener nadadores por equipo
app.get('/nadadores-por-equipo', (req, res) => {
  const { equipo } = req.query;
  if (!equipo) {
    return res.status(400).json({ error: 'El equipo es obligatorio' });
  }
  db.query('SELECT * FROM nadadores_natacion WHERE equipo = ?', [equipo], (err, results) => {
    if (err) {
      console.error('Error al obtener nadadores:', err);
      return res.status(500).json({ error: 'Error al obtener nadadores' });
    }
    res.json(results);
  });
});

// Eliminar un nadador
app.delete('/nadadores/:id', (req, res) => {
  db.query('DELETE FROM nadadores_natacion WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el nadador:', err);
      return res.status(500).json({ error: 'Error al eliminar el nadador' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nadador no encontrado' });
    }
    res.status(200).json({ message: 'Nadador eliminado correctamente' });
  });
});

// Actualizar un nadador
app.put('/nadadores/:id', (req, res) => {
  const { nombre, dni, sexo, estilo, prueba } = req.body;
  db.query(
    'UPDATE nadadores_natacion SET nombre = ?, dni = ?, sexo = ?, estilo = ?, prueba = ? WHERE id = ?',
    [nombre, dni, sexo, estilo, prueba, req.params.id],
    (err, result) => {
      if (err) {
        console.error('Error al actualizar el nadador:', err);
        return res.status(500).json({ error: 'Error al actualizar el nadador' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Nadador no encontrado' });
      }
      res.status(200).json({ message: 'Nadador actualizado correctamente' });
    }
  );
});

// Estado del servidor
app.get('/status', (req, res) => res.status(200).json({ message: 'Servidor en funcionamiento' }));

// Iniciar servidor
app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
