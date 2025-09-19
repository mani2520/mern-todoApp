import { useState, useEffect } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../api/todoApi";
import type { Todo } from "../api/todoApi";
import TodoItem from "../components/TodoItem";

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getTodos().then((res) => setTodos(res.data));
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) return;
    const res = await addTodo(title);
    setTodos([...todos, res.data]);
    setTitle("");
  };

  const handleToggle = async (id: string) => {
    await updateTodo(id, !completed);
    setTodos(
      todos.map((t) => (t._id === id ? { ...t, completed: !completed } : t))
    );
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    setTodos(todos.filter((t) => t._id !== id));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold underline">MERN TodoApp</h1>
      <form action="" onSubmit={handleAdd}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Task"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
