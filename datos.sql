-- Borrar todos los datos existentes en las tablas
DELETE FROM `equipos_futbol`;
DELETE FROM `equipos_baloncesto`;
DELETE FROM `nadadores_natacion`;

-- Volcado de datos para la tabla `equipos_futbol`
INSERT INTO `equipos_futbol` (`id`, `nombre`, `entrenador`, `email`, `telefono`, `categoria`, `jugadores`) VALUES
(1, 'Tigres FC', 'Juan Pérez', 'juan@tigres.com', '555-123456', 'Prebenjamín', '["Carlos Gómez", "Luis Hernández", "Miguel Álvarez"]'),
(2, 'Leones Unidos', 'María Rodríguez', 'maria@leones.com', '555-987654', 'Benjamín', '["Andrés Ruiz", "David Sánchez", "Pedro Morales"]'),
(3, 'Águilas Rojas', 'Pedro López', 'pedro@aguilas.com', '555-456789', 'Alevín', '["Juan Martín", "Raúl Pérez", "Fernando Díaz"]'),
(4, 'Halcones Azules', 'Ana Torres', 'ana@halcones.com', '555-112233', 'Infantil', '["Carlos Romero", "Sofía Díaz", "Luis García"]'),
(5, 'Osos Dorados', 'Luis Pérez', 'luis@osos.com', '555-445566', 'Cadete', '["Martín Vargas", "Sara Jiménez", "Antonio Castro"]'),
(6, 'Búhos Negritos', 'Raquel Mendoza', 'raquel@buho.com', '555-334455', 'Juvenil', '["Roberto Fernández", "Juliana Torres", "Alberto Ruiz"]');

-- Volcado de datos para la tabla `equipos_baloncesto`
INSERT INTO `equipos_baloncesto` (`id`, `nombre_equipo`, `localidad`, `direccion`, `modalidad`, `capitan`, `jugadores`) VALUES
(1, 'Dragones Basketball', 'Madrid', 'Calle Ficticia 123', '5x5', 'Carlos Pérez', '["Luis González", "Antonio Morales", "Eduardo Fernández", "Manuel Álvarez", "José Martín"]'),
(2, 'Tiburones Basket', 'Barcelona', 'Avenida Central 456', '3x3', 'Juan Torres', '["Francisco García", "Juan Pérez", "Antonio Jiménez"]'),
(3, 'Pumas Baloncesto', 'Sevilla', 'Plaza Mayor 789', '5x5', 'Laura Martínez', '["Raquel López", "Sofía Pérez", "Patricia Sánchez", "Lucía Gómez", "Beatriz Ruiz"]'),
(4, 'Bulls Basket', 'Valencia', 'Calle Gran Vía 101', '3x3', 'Carlos Rodríguez', '["David Fernández", "Pablo Sánchez", "Julio Torres"]'),
(5, 'Ángeles Azul', 'Zaragoza', 'Calle del Sol 202', '5x5', 'María González', '["Verónica Martínez", "Raquel Torres", "Cristina García", "Lorena Díaz"]');

-- Volcado de datos para la tabla `nadadores_natacion`
INSERT INTO `nadadores_natacion` (`id`, `equipo`, `nombre`, `dni`, `sexo`, `estilo`, `prueba`) VALUES
(1, 'Marlin Swim', 'Carlos García', '12345678A', 'Masculino', 'Crol', '100 metros'),
(2, 'Delfines Acuáticos', 'Ana Ruiz', '87654321B', 'Femenino', 'Mariposa', '200 metros'),
(3, 'Tiburones Nadar', 'Pedro López', '23456789C', 'Masculino', 'Braza', '50 metros'),
(4, 'Marlin Swim', 'Lucía Sánchez', '98765432D', 'Femenino', 'Crol', '100 metros'),
(5, 'Tiburones Nadar', 'Javier Martín', '13579246E', 'Masculino', 'Espalda', '400 metros'),
(6, 'Delfines Acuáticos', 'Patricia Pérez', '24681357F', 'Femenino', 'Mariposa', '50 metros'),
(7, 'Marlin Swim', 'José Gómez', '55566677G', 'Masculino', 'Crol', '200 metros'),
(8, 'Tiburones Nadar', 'Raquel Jiménez', '77788899H', 'Femenino', 'Braza', '100 metros');
