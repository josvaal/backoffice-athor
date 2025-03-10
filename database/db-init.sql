USE [master]
GO

IF DB_ID('bo_athor_db') IS NOT NULL
  set noexec on 

CREATE DATABASE [bo_athor_db];
GO

USE [bo_athor_db]
GO

-- Insertar roles en la tabla Role
-- INSERT INTO Role (name, description)
-- VALUES 
--     ('Usuario', 'Rol estándar para usuarios regulares'),
--     ('Admin', 'Rol para administradores con privilegios elevados'),
--     ('SuperAdmin', 'Rol para super administradores con acceso completo');
