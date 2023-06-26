import axios from "axios";

export const getUsersRequest = async () =>
  await axios.get("http://localhost:5062/api/Usuario/Lista");

export const createUserRequest = async (user) =>
  await axios.post("http://localhost:5062/api/Usuario/Crear", user);

export const deleteUserRequest = async (id) =>
  await axios.delete(`http://localhost:5062/api/Usuario/Eliminar/${id}`);

export const getUserRequest = async (id) =>
  await axios.get(`http://localhost:5062/api/Usuario/Obtener/${id}`);

export const updateUserRequet = async (id, newFields) => 
  await axios.put(`http://localhost:5062/api/Usuario/Editar/${id}`, newFields);