import { useState, useEffect } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../api/todoApi";
import type { TodoApi } from "../api/todoApi";
import TodoItem from "../components/TodoItem";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";

const Todo = () => {
  const { logout } = useAuth();

  const [todos, setTodos] = useState<TodoApi[]>([]);
  const [title, setTitle] = useState("");
  const [searchTodo, setSearchTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { username: contextUsername } = useAuth();

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (contextUsername) setUsername(contextUsername);
  }, [contextUsername]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosFromServer = await getTodos();
        setTodos(todosFromServer);
      } catch (error) {
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
    } catch (error: any) {
      console.log(error);
      toast.error(`${error.response?.data?.message}`);
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
      toast.error(`${error}`);
    }
  };

  const formattedUsername = username
    ? username.charAt(0).toUpperCase() + username.slice(1)
    : "User";

  const searchTodos = todos.filter((todo) => {
    return (todo.title || "").toLowerCase().includes(searchTodo.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <section className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight mb-1 text-left drop-shadow-sm">
              <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                Todo App
              </span>
            </h1>
            <p className="text-gray-400 text-sm font-medium pl-1">
              Stay organized, stay productive
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="focus:outline-none"
              aria-label="User menu"
            >
              <span className=" w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 border-2 border-blue-300 shadow hover:shadow-lg transition-all flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-blue-700"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </span>
            </button>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-20 animate-fade-in">
                <li className="px-5 py-3 bg-blue-50 text-gray-700 font-medium rounded-t-xl transition">
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-8 h-8 text-blue-700"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                    {formattedUsername}
                  </span>
                </li>
                <li className="px-5 py-3 hover:bg-blue-50 text-gray-700 font-medium cursor-pointer rounded-t-xl transition">
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 4v16m8-8H4" />
                    </svg>
                    Settings
                  </span>
                </li>
                <li
                  onClick={() => {
                    logout(), toast.success("Logged out successfully!");
                  }}
                  className="px-5 py-3 hover:bg-red-50 text-red-500 font-semibold cursor-pointer rounded-b-xl transition flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                  </svg>
                  Logout
                </li>
              </ul>
            )}
          </div>
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
          <div className="flex w-full gap-3">
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
              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow transition disabled:opacity-50"
              disabled={!title.trim()}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Todo;
