-- Crear y usar la base de datos
CREATE DATABASE IF NOT EXISTS clinica_espana;
USE clinica_espana;

-- Tabla de Usuarios (Almacena Pacientes y Administradores)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    rut VARCHAR(20) UNIQUE,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    prevision VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    rol ENUM('paciente', 'admin') DEFAULT 'paciente'
);

-- Tabla de Profesionales (Equipo Médico)
CREATE TABLE IF NOT EXISTS profesionales (
    id_profesional INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rut_personal VARCHAR(20) UNIQUE,
    rut_profesional VARCHAR(50) UNIQUE
);

-- Tabla de Procedimientos (Catálogo de Tratamientos)
CREATE TABLE IF NOT EXISTS procedimientos (
    id_procedimiento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    duracion_estimada INT NOT NULL
);

-- Tabla de Citas (Motor de Agendamiento con Llaves Foráneas)
CREATE TABLE IF NOT EXISTS citas (
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
CREATE TABLE IF NOT EXISTS historial_clinico (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL, 
    id_cita INT, 
    id_profesional INT,
    diagnostico TEXT NOT NULL,
    tratamiento_realizado TEXT NOT NULL, 
    presupuesto DECIMAL(10,2) DEFAULT 0,
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (id_paciente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE SET NULL,
    FOREIGN KEY (id_profesional) REFERENCES profesionales(id_profesional) ON DELETE SET NULL
);

-- Tabla de Disponibilidad Diaria
CREATE TABLE IF NOT EXISTS disponibilidad_diaria (
    id_disponibilidad INT AUTO_INCREMENT PRIMARY KEY,
    id_profesional INT NOT NULL,
    fecha DATE NOT NULL,
    citas_ocupadas INT DEFAULT 1,
    FOREIGN KEY (id_profesional) REFERENCES profesionales(id_profesional) ON DELETE CASCADE,
    UNIQUE KEY unique_profesional_fecha (id_profesional, fecha)
);

-- ==========================================
--          DATOS DE PRUEBA
-- ==========================================

-- Administrador y Pacientes (Todos con clave: 123456)
INSERT INTO usuarios (nombre, apellidos, rut, correo, telefono, prevision, password, rol) VALUES
('Admin', 'Principal', '11.111.111-1', 'admin@clinicaespana.es', '+56911111111', 'Isapre', '$2b$10$0EKInLBZpEQOTRhP4Q0hpereveMLl9.hKurEH9fFopz8lUXDvvR3O', 'admin'),
('Carlos', 'Sanhueza', '22.222.222-2', 'carlos@correo.cl', '+56922222222', 'Fonasa', '$2b$10$0EKInLBZpEQOTRhP4Q0hpereveMLl9.hKurEH9fFopz8lUXDvvR3O', 'paciente'),
('María', 'González', '33.333.333-3', 'maria@correo.cl', '+56933333333', 'Isapre', '$2b$10$0EKInLBZpEQOTRhP4Q0hpereveMLl9.hKurEH9fFopz8lUXDvvR3O', 'paciente'),
('Maguito', 'Explosivo', '20.000.000-1', 'maguito@explosivo.cl', '+56944444444', 'Fonasa', '$2b$10$0EKInLBZpEQOTRhP4Q0hpereveMLl9.hKurEH9fFopz8lUXDvvR3O', 'paciente');

-- Profesionales (Todos con clave: 123456)
INSERT INTO profesionales (nombre, apellidos, especialidad, correo, password, rut_personal, rut_profesional) VALUES
('Juan', 'Pérez', 'Odontólogo General', 'juan.perez@clinicaespana.es', '$2b$10$0EKInLBZpEQOTRhP4Q0hpereveMLl9.hKurEH9fFopz8lUXDvvR3O', '15.000.000-1', 'COL-1234'),
('Julio', 'Iglesias', 'Ortodoncista', 'julio@iglesias.com', '$2b$10$0EKInLBZpEQOTRhP4Q0hpereveMLl9.hKurEH9fFopz8lUXDvvR3O', '5.000.000-1', 'COL-5678');

-- Procedimientos
INSERT INTO procedimientos (nombre, duracion_estimada) VALUES
('Consulta general', 30),
('Blanqueamiento', 60),
('Ortodoncia', 45),
('Extracción', 60),
('Limpieza', 30);

-- Disponibilidad Diaria (Para Juan Pérez id=1 y Julio Iglesias id=2)
INSERT INTO disponibilidad_diaria (id_profesional, fecha, citas_ocupadas) VALUES
(1, CURDATE(), 2),
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1),
(2, CURDATE(), 1),
(2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 3);

-- Citas de Prueba
INSERT INTO citas (id_usuario, id_profesional, id_procedimiento, fecha, hora, estado) VALUES
(2, 1, 1, CURDATE(), '09:00:00', 'completada'),
(3, 1, 5, CURDATE(), '10:00:00', 'pendiente'),
(4, 2, 3, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '15:30:00', 'pendiente');

-- Historial Clínico de Prueba
INSERT INTO historial_clinico (id_paciente, id_cita, id_profesional, diagnostico, tratamiento_realizado, presupuesto, observaciones) VALUES
(2, 1, 1, 'Caries leve en molar', 'Obturación con resina', 45000.00, 'El paciente debe volver a revisión en 6 meses.'),
(3, NULL, 2, 'Gingivitis inicial', 'Limpieza profunda, profilaxis', 35000.00, 'Recomendar uso de hilo dental diario.');