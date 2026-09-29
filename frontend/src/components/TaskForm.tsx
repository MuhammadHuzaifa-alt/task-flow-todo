import {
  useState,
} from "react";

import type {
  Task,
  TaskFormData,
} from "../types/task";

import "../styles/TaskForm.css";

interface TaskFormProps {
  task?: Task | null;

  onSubmit: (
    data: TaskFormData
  ) => void;

  onCancel: () => void;
}

const emptyForm: TaskFormData = {
  title: "",
  description: "",
  due_date: "",
  status: "todo",
  priority: "medium",
};

const TaskForm = ({
  task,
  onSubmit,
  onCancel,
}: TaskFormProps) => {
  const initialForm: TaskFormData = task
    ? {
        title: task.title,
        description: task.description ?? "",
        due_date: task.due_date ?? "",
        status: task.status,
        priority: task.priority,
      }
    : emptyForm;

  const [
    formData,
    setFormData,
  ] = useState<TaskFormData>(
    initialForm
  );

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !formData.title.trim()
    ) {
      return;
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description:
        formData.description.trim(),
    });
  };

  return (
    <div className="task-form-wrapper">
      <div className="task-form-header">
        <div>
          <span className="form-eyebrow">
            {task
              ? "TASK MANAGEMENT"
              : "NEW TASK"}
          </span>

          <h2>
            {task
              ? "Update task"
              : "Create a new task"}
          </h2>

          <p>
            {task
              ? "Make changes to your task details."
              : "Add a task and keep your work organized."}
          </p>
        </div>

        <button
          className="form-close-button"
          onClick={onCancel}
          type="button"
        >
          ×
        </button>
      </div>

      <form
        className="task-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label htmlFor="title">
            Task title
          </label>

          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Deploy Django API"
            autoFocus
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={
              formData.description
            }
            onChange={handleChange}
            placeholder="Describe what needs to be done..."
            rows={5}
          />
        </div>

        <div className="form-group">
          <label htmlFor="due_date">
            Due date
          </label>

          <input
            id="due_date"
            name="due_date"
            type="date"
            value={formData.due_date ?? ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="todo">
                To Do
              </option>

              <option value="in_progress">
                In Progress
              </option>

              <option value="completed">
                Completed
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">
              Priority
            </label>

            <select
              id="priority"
              name="priority"
              value={
                formData.priority
              }
              onChange={handleChange}
            >
              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="form-cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="form-submit-button"
          >
            {task
              ? "Save changes"
              : "Create task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
