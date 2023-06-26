create database Reto;

use Reto;

create table Usuario(
	IdUsuario int primary key identity,
	Nombre varchar(50),
	Apellido varchar(50),
	Correo varchar(50),
	createAt datetime DEFAULT CURRENT_TIMESTAMP
)

drop table Usuario;

insert into Usuario(Nombre, Apellido, Correo) values 
('Erick', 'Villalobos Casanatan', 'villalobose143@gmail.com'),
('Jacky', 'Mendoza Ramirez', 'ramirez@gmail.com'),
('Angélica', 'Recursos Humanos', 'ange@gmail.com'),
('Maria', 'Delgado Moreno', 'mademo@gmail.com'),
('Jose', 'Mateo Mendo', 'majo@gmail.com'),
('Prueba1', 'Test Prueba', 'test@gmail.com'),
('Prueba2', 'Test Prueba2', 'test2@gmail.com')


select*from Usuario;