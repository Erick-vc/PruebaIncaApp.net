import { useEffect } from "react";
import UserCard from "../components/UserCard";
import { useUsers } from "../context/UserProvider";


const UserPage = () => {

  const { users, loadUsers} = useUsers();

  useEffect(() => {

    loadUsers();
  }, []);

  function renderMain() {
    if (!users) return <p className="text-white font-bold text-center text-xl">No hay usuarios o el servidor no está corriendo, Asegúrese de correr el backend en .net 
    `http://localhost:5062`
    </p>;
    return users.map((user) => <UserCard user={user} key={user.idUsuario} />);
  }

  return (

    <div>
      <h1 className="text-5xl text-white font-bold text-center">Usuarios</h1>
      <div className="grid grid-cols-3 gap-2">
      {renderMain()}
      </div>
    </div>

  );
};

export default UserPage;
