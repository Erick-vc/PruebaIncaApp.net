using System;


namespace CRUD_PRUEBA_INCAAPP.Models
{
    public class Usuario
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Correo { get; set; }
        public string createAt { get; set; }
    }
}
