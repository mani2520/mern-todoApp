import type { Todo } from "../api/todoApi";

interface Props {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: Props) => {
  return (
    <div>
      <li>
        <span onClick={() => onToggle(todo._id, todo.completed)}>
          {todo.title}
        </span>
        <button onClick={() => onDelete(todo._id)}>❌</button>
      </li>
    </div>
  );
};

export default TodoItem;
