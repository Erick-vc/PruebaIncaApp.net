import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="bg-zinc-700 flex justify-between px-10 py-4">
      <Link to='/' className="text-white font-bold">
      <h1 className="text-sm">PRUEBA INCA APP</h1>
      </Link>
      <ul className="flex gap-x-2 justify-center items-center">
        <li>
          <Link to="/" className="bg-slate-200 px-2 py-1">Inicio</Link>
        </li>
        <li>
          <Link to="/new" className="bg-slate-200 px-2 py-1">Crear Usuarios</Link>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
