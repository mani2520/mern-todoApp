import api from "./axios";

export interface TodoApi {
  _id: string;
  title: string;
  completed: boolean;
}

export const getTodos = async (): Promise<TodoApi[]> => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/todos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addTodo = (title: string) => {
  const token = localStorage.getItem("token");
  return api.post<TodoApi>(
    `/todos`,
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const updateTodo = async (id: string, data: Partial<TodoApi>) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/todos/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteTodo = (id: string) => {
  const token = localStorage.getItem("token");
  return api.delete<TodoApi>(`/todos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
