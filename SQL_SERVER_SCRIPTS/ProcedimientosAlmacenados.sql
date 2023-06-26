/*********  PROCEDIMIENTOS ALMACENADOS ****************/
go
use Reto
go

/*! LISTAR USUARIOS  !*/
create proc sp_lista_usuarios
as
begin
	select 
	IdUsuario,Nombre,
	Apellido,Correo,createAt
	from Usuario
end

go


/*! CREAR USUARIO  !*/
create proc sp_guardar_usuario(
@nombre varchar(50),
@apellido varchar(50),
@correo varchar(100)
)as
begin
	insert into Usuario(Nombre,Apellido,Correo)
	values(@nombre,@apellido,@correo)
end

go

/*! EDITAR USUARIO  !*/
create proc sp_editar_usuario(
@idUsuario int,
@nombre varchar(50) null,
@apellido varchar(50) null,
@correo varchar(50) null
)as
begin
	update Usuario set
	Nombre = isnull(@nombre,Nombre),
	Apellido = isnull(@apellido,Apellido),
	Correo = isnull(@correo,Correo)
	where IdUsuario = @idUsuario
end

go


/*! ELIMINAR USUARIO  !*/
create proc sp_eliminar_usuario(
@idUsuario int
)as
begin

 delete from Usuario where IdUsuario = @idUsuario

end