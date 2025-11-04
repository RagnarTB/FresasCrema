-- Migración para actualizar roles de usuarios de String a Enum
-- Convertir "ROLE_ADMIN" a "ADMIN"

UPDATE usuario
SET role = 'ADMIN'
WHERE role = 'ROLE_ADMIN';

UPDATE usuario
SET role = 'USER'
WHERE role = 'ROLE_USER';
