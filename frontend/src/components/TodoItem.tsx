import type { Todo } from "../api/todoApi";

interface Props {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: Props) => {
  return (
    <li className="flex items-center justify-between bg-white dark:bg-gray-100 p-3 rounded-2xl shadow transition-all group hover:shadow-md">
      <button
        onClick={() => onToggle(todo._id, todo.completed)}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        className={`flex-shrink-0 cursor-pointer w-6 h-6 rounded-full border-2 transition-colors duration-200 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-300
          ${
            todo.completed
              ? "bg-blue-500 border-blue-500"
              : "border-gray-300 bg-white"
          }
        `}
      >
        {todo.completed && (
          <svg
            className="w-4 h-4 text-white mx-auto"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>
      <span
        className={`flex-1 text-base sm:text-lg select-none transition-colors break-words
          ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}
        `}
        onClick={() => onToggle(todo._id, todo.completed)}
        tabIndex={0}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onToggle(todo._id, todo.completed);
          }
        }}
      >
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo._id)}
        aria-label="Delete todo"
        className="cursor-pointer ml-3 flex-shrink-0 text-red-500 hover:text-red-700 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </li>
  );
};

export default TodoItem;
