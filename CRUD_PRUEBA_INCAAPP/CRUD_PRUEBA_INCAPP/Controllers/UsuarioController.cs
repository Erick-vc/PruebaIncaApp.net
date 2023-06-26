using Microsoft.AspNetCore.Mvc;
using CRUD_PRUEBA_INCAAPP.Models;
using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;

namespace CRUD_PRUEBA_INCAPP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly string cadenaSQL;
        public UsuarioController(IConfiguration config)
        {
            // Almacenamos nuestra cadena de conexión
            cadenaSQL = config.GetConnectionString("CadenaSQL");
        }


        // *********************************** PROCEDIMIENTO PARA LISTAR *********************************
        [HttpGet]
        [Route("Lista")]
        public IActionResult Lista()
        {
           var lista = new List<Usuario>();
           try
            {
                //Nos conectamos a SQL
                using(var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    // Comando de ejecución (Procedimiento almacenado)
                    var cmd = new SqlCommand("sp_lista_usuarios", conexion);
                    // Especificamos el tipo de comando
                    cmd.CommandType = CommandType.StoredProcedure;
                    // Leemos el resultado del comando de ejecución
                    using (var rd = cmd.ExecuteReader())
                    {
                        while(rd.Read()) 
                        {
                            lista.Add(new Usuario()
                            {
                                IdUsuario = Convert.ToInt32(rd["IdUsuario"]),
                                Nombre = rd["Nombre"].ToString(),
                                Apellido = rd["Apellido"].ToString(),
                                Correo = rd["Correo"].ToString(),
                                createAt = rd["createAt"].ToString()
                            });
                        }
                    }
                }
                // Verificamos si la lsita está vacia
                if (lista.Count == 0)
                {
                    return StatusCode(StatusCodes.Status200OK, new { 
                        mensaje = "No hay usuarios registrados" 
                    });
                }
                return StatusCode(StatusCodes.Status200OK, new { 
                    mensaje = "Usuarios encontrados", response = lista 
                });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new {
                    mensaje = error.Message 
                });
            }
        }




        // **************************** PROCEDIMIENTO PARA LISTAR USUARIO POR SU ID ****************************
        [HttpGet]
        [Route("Obtener/{idUsuario:int}")]
        public IActionResult Obtener(int idUsuario)
        {
            try
            {
                Usuario usuario = null;
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_lista_usuarios", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            // Identificamos si existe por el id
                            if (Convert.ToInt32(rd["IdUsuario"]) == idUsuario)
                            {
                                usuario = new Usuario()
                                {
                                    IdUsuario = Convert.ToInt32(rd["IdUsuario"]),
                                    Nombre = rd["Nombre"].ToString(),
                                    Apellido = rd["Apellido"].ToString(),
                                    Correo = rd["Correo"].ToString()
                                };
                                break;
                            }
                        }
                    }
                }
                if (usuario == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { 
                        mensaje = "Usuario no encontrado" 
                    });
                }

                return StatusCode(StatusCodes.Status200OK, new { 
                    mensaje = "Usuario encontrado", response = usuario 
                });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { 
                    mensaje = "Error al obtener el usuario: " + error.Message 
                });
            }
        }

        
        
        //Funcion para validar email
        private bool IsValidEmail(string email)
        {
            string emailRegexPattern = @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$";
            return Regex.IsMatch(email, emailRegexPattern);
        }

        // *********************************** PROCEDIMIENTO CREAR USUARIO ***************************************
        [HttpPost]
        [Route("Crear")]
        public IActionResult Crear([FromBody] Usuario objeto)
        {
            Usuario usuario = new Usuario();
            try
            {
                // Validar campos vacíos o espacios en blanco
                if (string.IsNullOrWhiteSpace(objeto.Nombre) || 
                    string.IsNullOrWhiteSpace(objeto.Apellido) || 
                    string.IsNullOrWhiteSpace(objeto.Correo))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { 
                        mensaje = "Debe proporcionar todos los campos requeridos" 
                    });
                }
                // Validar formato de correo electrónico
                if (!IsValidEmail(objeto.Correo))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { 
                        mensaje = "El formato del correo electrónico no es válido" 
                    });
                }

                //Nos conectamos
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_guardar_usuario", conexion);
                    cmd.Parameters.AddWithValue("nombre", objeto.Nombre);
                    cmd.Parameters.AddWithValue("apellido", objeto.Apellido);
                    cmd.Parameters.AddWithValue("correo", objeto.Correo);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.ExecuteNonQuery();
                }
                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Creado con éxito" });
            } catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }


        // ************************************* PROCEDIMIENTO PARA EDITAR USUARIO ************************************
        [HttpPut]
        [Route("Editar/{idUsuario:int}")]
        public IActionResult Editar(int idUsuario, [FromBody] Usuario objeto)
        {
            try
            {
                bool usuarioExiste = false;
                Usuario usuarioEditado = null;

                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var consultaExistencia = new SqlCommand("SELECT COUNT(*) FROM Usuario WHERE IdUsuario = @idUsuario", conexion);
                    consultaExistencia.Parameters.AddWithValue("@idUsuario", idUsuario);

                    // Verificar si el usuario existe
                    int count = (int)consultaExistencia.ExecuteScalar();
                    usuarioExiste = count > 0;

                    if (!usuarioExiste)
                    {
                        return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Usuario no encontrado" });
                    }

                    var cmd = new SqlCommand("sp_editar_usuario", conexion);
                    cmd.Parameters.AddWithValue("idUsuario", idUsuario);
                    cmd.Parameters.AddWithValue("nombre", objeto.Nombre is null ? DBNull.Value : objeto.Nombre);
                    cmd.Parameters.AddWithValue("apellido", objeto.Apellido is null ? DBNull.Value : objeto.Apellido);
                    cmd.Parameters.AddWithValue("correo", objeto.Correo is null ? DBNull.Value : objeto.Correo);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.ExecuteNonQuery();
                    usuarioEditado = new Usuario()
                    {
                        IdUsuario = idUsuario,
                        Nombre = objeto.Nombre,
                        Apellido = objeto.Apellido,
                        Correo = objeto.Correo
                    };
                }

                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Editado", usuario = usuarioEditado });

            } catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }

        // ****************************** PROCEDIMIENTO PARA ELIMINAR USUARIO ********************************************
        [HttpDelete]
        [Route("Eliminar/{idUsuario:int}")]
        public IActionResult Eliminar(int idUsuario)
        {
            try
            {
                // Verificar si el usuario existe en la base de datos
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var verificarCmd = new SqlCommand("SELECT COUNT(*) FROM Usuario WHERE idUsuario = @idUsuario", conexion);
                    verificarCmd.Parameters.AddWithValue("idUsuario", idUsuario);

                    int usuarioExistente = (int)verificarCmd.ExecuteScalar();
                    if (usuarioExistente == 0)
                    {
                        return NotFound(new { mensaje = "El usuario con el ID especificado no existe." });
                    }
                }

                // Eliminamos el usuario de la base de datos
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_eliminar_usuario", conexion);
                    cmd.Parameters.AddWithValue("idUsuario", idUsuario);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.ExecuteNonQuery();
                }

                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Usuario eliminado correctamente" });
            } catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new {mensaje = error.Message});
            }
        }


    }
}
