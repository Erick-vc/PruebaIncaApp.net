/* eslint-disable react/prop-types */
import { Form, Formik } from "formik";
import { useUsers } from "../context/UserProvider";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";

const UserForm = () => {
  const { createUser, getUser, updateUser } = useUsers();
  const [user, setUser] = useState({
    nombre: "",
    apellido: "",
    correo: "",
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      if (params.id) {
        const user = await getUser(params.id);
        setUser({
          nombre: user.nombre,
          apellido: user.apellido,
          correo: user.correo,
        });
      }
    };
    loadUser();
  }, []);

  // * Mensaje de alerta
  const [mensaje, guardarMensaje] = useState(null);

  const schemaValidacion = Yup.object({
    nombre: Yup.string().required("* El nombre es requerido"),
    apellido: Yup.string().required("* El apellido es requerido"),
    correo: Yup.string()
      .email("* Correo inválido")
      .required("* El correo es requerido"),
  });

  const actualizarInfoUsuario = async (values) => {
    try {
      if (params.id) {
        await updateUser(params.id, values);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cliente editado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await createUser(values);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cliente creado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      setTimeout(() => {
        navigate("/");
        setUser({
          name: "",
          last_name: "",
          email: "",
        });
      }, 1500);
    } catch (error) {
      guardarMensaje(error.message);
      setTimeout(() => {
        guardarMensaje(null);
      }, 2000);
    }
  };

  return (
    <div>
      <Formik
        validationSchema={schemaValidacion}
        enableReinitialize
        initialValues={user}
        onSubmit={async (values) => {
          actualizarInfoUsuario(values);
        }}
      >
        {(props) => (
          <Form className="bg-slate-300 max-w-sm rounded-md p-4 mx-auto mt-16 flex flex-col gap-2">
            <h1 className="text-xl font-bold uppercase text-center">
              {params.id ? "Editar Usuario" : "Crear Usuario"}
            </h1>

            <label className="block">Nombre</label>
            <input
              className="px-2 py-1 rounded-sm w-full"
              type="text"
              name="nombre"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.nombre}
              placeholder="Escribe tu nombre"
            />
            {props.touched.nombre && props.errors.nombre ? (
              <p className="mb-2 pl-1 border-l-4 border-gray-500 text-red-500 text-xs italic">
                {props.errors.nombre}
              </p>
            ) : null}

            <label className="block">Apellido</label>
            <input
              className="px-2 py-1 rounded-sm w-full"
              type="text"
              name="apellido"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.apellido}
              placeholder="Escribe tu nombre"
            />

            {props.touched.apellido && props.errors.apellido ? (
              <p className="mb-2 pl-1 border-l-4 border-gray-500 text-red-500 text-xs italic">
                {props.errors.apellido}
              </p>
            ) : null}

            <label className="block">Correo</label>
            <input
              className="px-2 py-1 rounded-sm w-full"
              type="text"
              name="correo"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.correo}
              placeholder="Escribe tu nombre"
            />
            {props.touched.correo && props.errors.correo ? (
              <p className="mb-2 pl-1 border-l-4 border-gray-500 text-red-500 text-xs italic">
                {props.errors.correo}
              </p>
            ) : null}

            <button
              className="block mt-2 bg-indigo-500 px-2 py-2 text-white w-full rounded-md"
              type="submit"
              disabled={props.isSubmitting}
            >
              {props.isSubmitting ? "Guardando" : "Guardar"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserForm;
