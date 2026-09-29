import type { Task } from "../types/task";

import "../styles/TaskCard.css";

interface TaskCardProps {
  task: Task;

  onDelete: (
    id: number
  ) => void;

  onEdit: (
    task: Task
  ) => void;
}

const TaskCard = ({
  task,
  onDelete,
  onEdit,
}: TaskCardProps) => {
  const formatStatus = (
    status: string
  ) => {
    return status
      .replace("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  return (
    <article className="task-card">
      <div className="task-card-top">
        <span
          className={`priority-badge ${task.priority}`}
        >
          <span className="priority-dot" />

          {task.priority}
        </span>

        <button
          className="task-menu"
          aria-label="Task menu"
        >
          ⋮
        </button>
      </div>

      <div className="task-content">
        <h3>{task.title}</h3>

        <p>
          {task.description ||
            "No description provided for this task."}
        </p>
      </div>

      <div className="task-footer">
        <div className="task-status-row">
          <span
            className={`status-badge ${task.status}`}
          >
            <span className="status-dot" />

            {formatStatus(
              task.status
            )}
          </span>

          <span className="task-date">
            {formatDate(
              task.created_at
            )}
          </span>
        </div>

        <div className="task-actions">
          <button
            className="task-edit-button"
            onClick={() =>
              onEdit(task)
            }
          >
            Edit
          </button>

          <button
            className="task-delete-button"
            onClick={() =>
              onDelete(task.id)
            }
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;