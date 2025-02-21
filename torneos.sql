-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-02-2025 a las 20:39:27
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `torneos_futbol`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos_baloncesto`
--

CREATE TABLE `equipos_baloncesto` (
  `id` int(11) NOT NULL,
  `nombre_equipo` varchar(100) DEFAULT NULL,
  `localidad` varchar(100) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `modalidad` varchar(10) DEFAULT NULL,
  `capitan` varchar(100) DEFAULT NULL,
  `jugadores` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos_futbol`
--

CREATE TABLE `equipos_futbol` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `entrenador` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `jugadores` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipos_futbol`
--

INSERT INTO `equipos_futbol` (`id`, `nombre`, `entrenador`, `email`, `telefono`, `categoria`, `jugadores`) VALUES
(1, '77777', '7777', '777', '77777', 'Prebenjamín', '[\"7777\",\"77777\",\"7777777\"]'),
(2, '77777', '7777', '777', '77777', 'Prebenjamín', '[\"7777\",\"77777\",\"7777777\"]'),
(3, '77777', '7777', '777', '77777', 'Prebenjamín', '[\"7777\",\"77777\",\"7777777\"]');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nadadores_natacion`
--

CREATE TABLE `nadadores_natacion` (
  `id` int(11) NOT NULL,
  `equipo` varchar(100) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `sexo` varchar(10) DEFAULT NULL,
  `estilo` varchar(50) DEFAULT NULL,
  `prueba` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `equipos_baloncesto`
--
ALTER TABLE `equipos_baloncesto`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `equipos_futbol`
--
ALTER TABLE `equipos_futbol`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `nadadores_natacion`
--
ALTER TABLE `nadadores_natacion`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `equipos_baloncesto`
--
ALTER TABLE `equipos_baloncesto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `equipos_futbol`
--
ALTER TABLE `equipos_futbol`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `nadadores_natacion`
--
ALTER TABLE `nadadores_natacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
