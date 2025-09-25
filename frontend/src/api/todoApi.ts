import axios from "axios";

const API_URL = import.meta.env.API_URL;

export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

export const getTodos = async (): Promise<Todo[]> => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addTodo = (title: string) => {
  const token = localStorage.getItem("token");
  return axios.post<Todo>(
    `${API_URL}`,
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const updateTodo = async (id: string, data: Partial<Todo>) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteTodo = (id: string) => {
  const token = localStorage.getItem("token");
  return axios.delete<Todo>(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
