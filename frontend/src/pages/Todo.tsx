import { useState, useEffect } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../api/todoApi";
import type { TodoApi } from "../api/todoApi";
import TodoItem from "../components/TodoItem";
import { toast } from "react-toastify";

const Todo = () => {
  const [todos, setTodos] = useState<TodoApi[]>([]);
  const [title, setTitle] = useState("");
  const [searchTodo, setSearchTodo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosFromServer = await getTodos();
        console.log("✅ Todos from server:", todosFromServer);
        setTodos(todosFromServer);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load todos");
        setTodos([]);
      }
    };
    fetchTodos();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await addTodo(title);
      setTodos([...todos, res.data]);
      setTitle("");
      toast.success("Task added!");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      const updated = await updateTodo(id, { completed: !completed });
      setTodos((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, completed: updated.completed } : t
        )
      );
      toast.success("Task updated!");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    setTodos(todos.filter((t) => t._id !== id));
    toast.success("Task deleted!");
  };

  const handleEdit = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    try {
      const updated = await updateTodo(id, { title: newTitle });
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, title: updated.title } : todo
        )
      );
      toast.success("Task updated!");
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  const searchTodos = todos.filter((todo) => {
    return (todo.title || "").toLowerCase().includes(searchTodo.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <section className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-center text-blue-700 tracking-tight mb-2">
            Todo App
          </h1>
        </header>

        <div className="mb-4">
          <input
            type="text"
            value={searchTodo}
            onChange={(e) => setSearchTodo(e.target.value)}
            placeholder="Search Task"
            className="flex-1 w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            aria-label="Add a new todo"
          />
        </div>

        <ul className="space-y-3 h-[400px] overflow-y-auto pr-3 my-thin-scrollbar">
          {searchTodos.length === 0 ? (
            <li className="text-center text-gray-400 py-8">No todos found!</li>
          ) : (
            searchTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </ul>

        <form
          onSubmit={handleAdd}
          className="flex items-center gap-3 mt-4"
          autoComplete="off"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            aria-label="Add a new todo"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow transition disabled:opacity-50"
            disabled={!title.trim()}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Todo;
