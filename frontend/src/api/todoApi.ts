import api from "./axios";

export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

export const getTodos = async (): Promise<Todo[]> => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addTodo = (title: string) => {
  const token = localStorage.getItem("token");
  return api.post<Todo>(
    `/`,
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const updateTodo = async (id: string, data: Partial<Todo>) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteTodo = (id: string) => {
  const token = localStorage.getItem("token");
  return api.delete<Todo>(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
