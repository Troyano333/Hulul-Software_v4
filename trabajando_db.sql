-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-06-2025 a las 01:42:39
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
-- Base de datos: `trabajando_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` varchar(10) DEFAULT NULL,
  `lugar` varchar(255) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `restricciones` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`id`, `nombre`, `descripcion`, `fecha`, `hora`, `lugar`, `ciudad`, `categoria`, `restricciones`, `foto`, `activo`, `fecha_creacion`) VALUES
(1, 'Silvestre', 'Vive una noche llena de ritmo y pasión con Silvestre Dangond interpretando sus grandes éxitos de la música vallenata.', '2025-06-25', '8:00 PM', 'Gran Salón Disco Caribe', 'Barranquilla', 'concierto', 'Mayores de 18 años', './img_eventos/silvestre.jfif', 1, '2025-06-01 04:23:41'),
(2, 'Chawala', 'Disfruta de la mejor música urbana y hip hop con Chawala y sus invitados en un ambiente vibrante.', '2025-07-10', '9:00 PM', 'Terraza Lounge', 'Bogotá', 'concierto', 'Mayores de 21 años', './img_eventos/chawala.jfif', 1, '2025-06-01 04:23:41'),
(3, 'Tremendo', 'Fiesta con la mejor selección de reguetón y música electrónica para una noche inolvidable.', '2025-08-15', '10:00 PM', 'Club Central', 'Medellín', 'festival', 'Mayores de 18 años', './img_eventos/tremendo.jfif', 1, '2025-06-01 04:23:41'),
(4, 'Maluma', 'Maluma llega a su ciudad natal con un espectáculo lleno de reguetón, luces y emoción que no te puedes perder.', '2025-08-30', '8:00 PM', 'Estadio Atanasio Girardot', 'Medellín', 'concierto', 'Mayores de 16 años', './img_eventos/maluma.webp', 1, '2025-06-01 04:23:41'),
(5, 'Shakira', 'Shakira regresa a Barranquilla con su gira internacional, lista para hacer vibrar a su público con sus mayores éxitos.', '2025-09-05', '9:00 PM', 'Estadio Metropolitano', 'Barranquilla', 'concierto', 'Apto para todas las edades', './img_eventos/shakira.jpg', 1, '2025-06-01 04:23:41'),
(6, 'DJ Dever', 'Vive una noche explosiva con DJ Dever mezclando en vivo sus mejores beats electrónicos y urbanos en Valledupar.', '2025-09-12', '10:00 PM', 'Parque de la Leyenda Vallenata', 'Valledupar', 'festival', 'Mayores de 18 años', './img_eventos/dj_dever.jfif', 1, '2025-06-01 04:23:41'),
(7, 'Carlos Vives', 'Disfruta una velada mágica con Carlos Vives y su contagiosa mezcla de vallenato y pop colombiano en Bogotá.', '2025-09-20', '8:30 PM', 'Movistar Arena', 'Bogotá', 'concierto', 'Mayores de 14 años', './img_eventos/carlos_vives.jpg', 1, '2025-06-01 04:23:41'),
(19, 'luis miguiel', 'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm', '0000-00-00', '14:02', 'gran salon', 'Barranquilla', 'concierto', 'mayores de 18', './img_eventos/1748921364_20250530_1647_León en Fuego_remix_01jwhjj460e54s2a0s3e9vem0r.png', 0, '2025-06-03 03:29:24'),
(20, 'tarjeta de debito', 'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm', '1000-10-10', '10:10', 'gran salon', 'Medellín', 'concierto', 'mayores de 18', './img_eventos/1748921578_20250530_1545_Kratos y Zeus Sena_simple_compose_01jwhf0057ebg8fcqez5b2xsar.png', 0, '2025-06-03 03:32:58'),
(21, 'ola mundo', 'mkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', '1000-10-10', '10:10', 'gran salon', 'Barranquilla', 'concierto', 'mayores de 18', './img_eventos/1748922996_20250530_1641_León Dorado de Discoteca_simple_compose_01jwhj72esfj8tkbkeah1qs5wb.png', 0, '2025-06-03 03:56:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `tipo_palco` varchar(50) NOT NULL,
  `precio` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `hora_reserva` time NOT NULL,
  `lugar` varchar(100) NOT NULL,
  `evento` varchar(255) NOT NULL,
  `fecha_evento` date DEFAULT NULL,
  `fecha_reserva` date DEFAULT NULL,
  `estado` varchar(50) NOT NULL DEFAULT 'valido',
  `fecha_uso` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `celular` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `last_password_reset` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
