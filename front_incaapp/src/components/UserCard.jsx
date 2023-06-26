/* eslint-disable react/prop-types */
import { useUsers } from "../context/UserProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function UserCard({ user }) {
  const { deleteUser } = useUsers();
  const navigate = useNavigate();

  // ? Eliminar un usuario
  const confirmedDeleteUser = () => {
    Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta accion no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
      concaelButtonText: "No, Cancelar",
    }).then( async (result) => {
      if (result.isConfirmed) {
        try {
          deleteUser(user.idUsuario)
        } catch (error) {
          console.log(error)
        }
      }
    })
  }

  return (
    <div className="bg-slate-200 rounded-md p-4 flex flex-col gap-2" key={user.idUsuario}>
      <h3 className="text-md font-bold">{user.nombre} {user.apellido}</h3>
      <h3 className="text-md">{user.correo}</h3>
      <span className="text-md">{user.createAt}</span>
      <div className="flex gap-x-2 mt-2">
        <button className="bg-red-500 px-2 py-1 text-white" onClick={() => confirmedDeleteUser()}>Eliminar</button>
        <button className="bg-slate-600 px-2 py-1 text-white" onClick={() => navigate(`/edit/${user.idUsuario}`)}>
          Editar
        </button>
      </div>
    </div>
  );
}

export default UserCard;
