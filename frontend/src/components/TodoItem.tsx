import { useEffect, useState } from "react";
import type { Todo } from "../api/todoApi";

interface Props {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleSave = () => {
    if (newTitle.trim() && newTitle !== todo.title) {
      onEdit(todo._id, newTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewTitle(todo.title);
    setIsEditing(false);
  };

  useEffect(() => {
    setNewTitle(todo.title);
  }, [todo.title]);

  return (
    <li className="flex items-center gap-3 bg-white dark:bg-gray-50 p-4 rounded-2xl shadow group hover:shadow-lg transition-all">
      <button
        onClick={() => onToggle(todo._id, todo.completed)}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300
          ${
            todo.completed
              ? "bg-blue-600 border-blue-600"
              : "border-gray-300 bg-white"
          }
        `}
      >
        {todo.completed && (
          <svg
            className="w-4 h-4 text-white"
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

      <div className="flex-1 flex items-center min-w-0">
        {isEditing ? (
          <form
            className="flex w-full items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-base bg-blue-50"
              autoFocus
              maxLength={100}
              aria-label="Edit todo"
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCancel();
              }}
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition focus:outline-none focus:ring-2 focus:ring-green-300"
              aria-label="Save"
              title="Save"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 0 0-1.414 0L8 12.586 4.707 9.293a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Cancel"
              title="Cancel"
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
          </form>
        ) : (
          <>
            <span
              className={`flex-1 text-base sm:text-lg select-none transition-colors break-words cursor-pointer outline-none
                ${
                  todo.completed
                    ? "line-through text-gray-400"
                    : "text-gray-900"
                }
                group-hover:text-blue-700
              `}
              onClick={() => onToggle(todo._id, todo.completed)}
              tabIndex={0}
              aria-label={
                todo.completed ? "Mark as incomplete" : "Mark as complete"
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onToggle(todo._id, todo.completed);
                }
              }}
              title={todo.title}
            >
              {todo.title}
            </span>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => {
              setNewTitle(todo.title);
              setIsEditing(true);
            }}
            className="p-2 rounded-full text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Edit todo"
            title="Edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 21v-3.75L14.06 6.19a2 2 0 012.83 0l1.92 1.92a2 2 0 010 2.83L7.75 21H3zM16.5 7.5l.5.5" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(todo._id)}
            aria-label="Delete todo"
            title="Delete"
            className="p-2 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-300"
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
        </div>
      )}
    </li>
  );
};

export default TodoItem;
