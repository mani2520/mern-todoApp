import axios from "axios";

const API_URL = "http://localhost:5000/api/todos";

export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

export const getTodos = () => axios.get(API_URL);

export const addTodo = (title: string) => {
  axios.post<Todo>(API_URL, { title });
};

export const updateTodo = (id: string, completed: boolean) => {
  axios.put<Todo>(`${API_URL}/${id}`, { completed });
};

export const deleteTodo = (id: string) => {
  axios.delete<Todo>(`${API_URL}/${id}`);
};
