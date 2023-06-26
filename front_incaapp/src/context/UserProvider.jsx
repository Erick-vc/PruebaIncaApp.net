/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import {
  getUsersRequest,
  deleteUserRequest,
  createUserRequest,
  getUserRequest,
  updateUserRequet,
} from "../api/User.api";
import { UserContext } from "./UserContext";

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe estar en un contexto provider");
  }
  return context;
};

export const UserContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const respuesta = await getUsersRequest();
      // console.log(respuesta.data.response)
      setUsers(respuesta.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteUserRequest(id);
      setUsers(users.filter((user) => user.idUsuario !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const createUser = async (user) => {
    try {
      await createUserRequest(user);
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async (id) => {
    try {
      const respuesta = await getUserRequest(id);
      // console.log(respuesta.data.response)
      return respuesta.data.response;
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (id, newFields) => {
    try {
      const response = await updateUserRequet(id, newFields);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider
      value={{ users, loadUsers, deleteUser, createUser, getUser, updateUser}}
    >
      {children}
    </UserContext.Provider>
  );
};
