-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS clinica_espana;
USE clinica_espana;

--Tabla de Usuarios (Pacientes y Administradores)
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'paciente') DEFAULT 'paciente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Tabla de Profesionales (Dentistas)
CREATE TABLE profesionales (
    id_profesional INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo'
);

--Tabla de Procedimientos
CREATE TABLE procedimientos (
    id_procedimiento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    duracion_estimada_minutos INT NOT NULL
);

--Tabla de Citas
CREATE TABLE citas (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_profesional INT NOT NULL,
    id_procedimiento INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado ENUM('pendiente', 'completada', 'cancelada') DEFAULT 'pendiente',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_profesional) REFERENCES profesionales(id_profesional) ON DELETE CASCADE,
    FOREIGN KEY (id_procedimiento) REFERENCES procedimientos(id_procedimiento) ON DELETE CASCADE
);

-- Tabla de Historial Clínico
CREATE TABLE historial_clinico (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_cita INT,
    diagnostico TEXT NOT NULL,
    tratamiento_realizado TEXT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE SET NULL
);

--Insertar datos de prueba para los procedimientos
INSERT INTO procedimientos (nombre, duracion_estimada_minutos) VALUES 
('Consulta General', 30),
('Evaluación', 30),
('Blanqueamiento', 60),
('Ortodoncia', 45),
('Endodoncia', 90),
('Extracción', 60),
('Obturación', 45),
('Implante', 120),
('Limpieza', 45);




--Insertar administrador de prueba
INSERT INTO usuarios (nombre, apellidos, correo, password, rol) 
VALUES (
    'NombreAdmin', 
    'ApellidosAdmin', 
    'admin1@clinicaespana.es', 
    '123456789', 
    'admin'
);