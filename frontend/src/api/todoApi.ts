import axios from "axios";

const API_URL = "https://mern-todoapp-ht44.onrender.com/api/todos";

export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

export const getTodos = async (): Promise<Todo[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addTodo = (title: string) => {
  return axios.post<Todo>(API_URL, { title });
};

export const updateTodo = async (id: string, data: Partial<Todo>) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteTodo = (id: string) => {
  return axios.delete<Todo>(`${API_URL}/${id}`);
};
