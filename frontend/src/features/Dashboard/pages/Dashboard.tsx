import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";

import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import TaskCard from "../../../components/TaskCard";
import TaskForm from "../../../components/TaskForm";

import api from "../../../services/api";

import type { Task, TaskFormData } from "../../../types/task";

import "../styles/Dashboard.css";

type FilterType = "all" | "todo" | "in_progress" | "completed";

interface ApiErrorData {
  due_date?: string | string[];
  detail?: string;
  message?: string;
}

const normalizeDueDate = (value: string | null): string | undefined => {
  if (!value || !value.trim()) {
    return undefined;
  }

  const trimmedValue = value.trim();

  // Already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    return trimmedValue;
  }

  // ISO datetime format
  if (trimmedValue.includes("T")) {
    const datePart = trimmedValue.split("T")[0];

    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
  }

  // DD/MM/YYYY format
  const slashMatch = trimmedValue.match(
    /^(\d{2})\/(\d{2})\/(\d{4})$/
  );

  if (slashMatch) {
    const [, day, month, year] = slashMatch;

    return `${year}-${month}-${day}`;
  }

  // DD-MM-YYYY format
  const dashMatch = trimmedValue.match(
    /^(\d{2})-(\d{2})-(\d{4})$/
  );

  if (dashMatch) {
    const [, day, month, year] = dashMatch;

    return `${year}-${month}-${day}`;
  }

  // Try JavaScript Date as a final fallback
  const parsedDate = new Date(trimmedValue);

  if (!Number.isNaN(parsedDate.getTime())) {
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return undefined;
};

const getDueDateError = (error: unknown): string | null => {
  if (!isAxiosError<ApiErrorData>(error)) {
    return null;
  }

  const responseData = error.response?.data;

  if (!responseData?.due_date) {
    return null;
  }

  const dueDateMessage = Array.isArray(responseData.due_date)
    ? responseData.due_date.join(", ")
    : responseData.due_date;

  return `Due date error: ${dueDateMessage}`;
};

const getApiErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (!isAxiosError<ApiErrorData>(error)) {
    return fallback;
  }

  const responseData = error.response?.data;

  if (responseData?.detail) {
    return responseData.detail;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  return fallback;
};

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Initial task loading.
   *
   * We keep loading=true initially, so we do not need to call
   * setLoading(true) synchronously inside useEffect.
   *
   * State updates happen after the API request completes.
   */
  useEffect(() => {
    let cancelled = false;

    const loadInitialTasks = async () => {
      try {
        const response = await api.get("/tasks/");

        if (cancelled) {
          return;
        }

        const data = response.data;

        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks(data.results ?? []);
        }

        setError("");
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        console.error("Failed to load tasks:", error);

        setError(
          getApiErrorMessage(
            error,
            "Unable to load your tasks. Please try again."
          )
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadInitialTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Used after creating/updating/deleting a task
   * and when the user clicks Retry.
   */
  const fetchTasks = async () => {
    try {
      setError("");
      setLoading(true);

      const response = await api.get("/tasks/");
      const data = response.data;

      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks(data.results ?? []);
      }
    } catch (error: unknown) {
      console.error("Failed to load tasks:", error);

      setError(
        getApiErrorMessage(
          error,
          "Unable to load your tasks. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Filter and search tasks.
   */
  const filteredTasks = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !searchValue ||
        task.title.toLowerCase().includes(searchValue) ||
        task.description.toLowerCase().includes(searchValue);

      const matchesFilter =
        filter === "all" || task.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  /*
   * Dashboard statistics.
   */
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  /*
   * Create task.
   */
  const createTask = async (data: TaskFormData) => {
    try {
      setError("");

      const taskData = {
        ...data,
        due_date: normalizeDueDate(data.due_date),
      };

      await api.post("/tasks/", taskData);

      await fetchTasks();

      setShowForm(false);
    } catch (error: unknown) {
      console.error("Failed to create task:", error);

      console.error(
        "Status:",
        isAxiosError(error) ? error.response?.status : undefined
      );

      console.error(
        "Response data:",
        isAxiosError(error)
          ? JSON.stringify(error.response?.data, null, 2)
          : undefined
      );

      const dueDateError = getDueDateError(error);

      if (dueDateError) {
        setError(dueDateError);
        return;
      }

      setError(
        getApiErrorMessage(
          error,
          "Unable to create the task."
        )
      );
    }
  };

  /*
   * Update task.
   */
  const updateTask = async (data: TaskFormData) => {
    if (!selectedTask) {
      return;
    }

    try {
      setError("");

      const taskData = {
        ...data,
        due_date: normalizeDueDate(data.due_date),
      };

      await api.put(
        `/tasks/${selectedTask.id}/`,
        taskData
      );

      await fetchTasks();

      setSelectedTask(null);
      setShowForm(false);
    } catch (error: unknown) {
      console.error("Failed to update task:", error);

      console.error(
        "Status:",
        isAxiosError(error) ? error.response?.status : undefined
      );

      console.error(
        "Response data:",
        isAxiosError(error)
          ? JSON.stringify(error.response?.data, null, 2)
          : undefined
      );

      const dueDateError = getDueDateError(error);

      if (dueDateError) {
        setError(dueDateError);
        return;
      }

      setError(
        getApiErrorMessage(
          error,
          "Unable to update the task."
        )
      );
    }
  };

  /*
   * Delete task.
   */
  const deleteTask = async (id: number) => {
    try {
      setError("");

      await api.delete(`/tasks/${id}/`);

      await fetchTasks();
    } catch (error: unknown) {
      console.error("Failed to delete task:", error);

      setError(
        getApiErrorMessage(
          error,
          "Unable to delete the task."
        )
      );
    }
  };

  /*
   * Open create form.
   */
  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Open edit form.
   */
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Close form.
   */
  const closeForm = () => {
    setShowForm(false);
    setSelectedTask(null);
  };

  /*
   * Toggle sidebar.
   */
  const handleMenuClick = () => {
    setSidebarOpen((previous) => !previous);
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dashboard-main">
        <Navbar onMenuClick={handleMenuClick} />

        <main className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h1>Dashboard</h1>
              <p>Manage your tasks and stay productive.</p>
            </div>

            <button
              type="button"
              className="create-task-button"
              onClick={handleCreateTask}
            >
              + Create Task
            </button>
          </div>

          {error && (
            <div className="dashboard-error">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => void fetchTasks()}
              >
                Retry
              </button>
            </div>
          )}

          <section className="stats-container">
            <div className="stat-card">
              <div className="stat-content">
                <span className="stat-label">
                  Total Tasks
                </span>

                <strong className="stat-number">
                  {totalTasks}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <span className="stat-label">
                  To Do
                </span>

                <strong className="stat-number">
                  {todoTasks}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <span className="stat-label">
                  In Progress
                </span>

                <strong className="stat-number">
                  {inProgressTasks}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <span className="stat-label">
                  Completed
                </span>

                <strong className="stat-number">
                  {completedTasks}
                </strong>
              </div>
            </div>
          </section>

          {showForm && (
            <section className="task-form-section">
              <TaskForm
                key={
                  selectedTask?.id
                    ? `edit-${selectedTask.id}`
                    : "create"
                }
                task={selectedTask}
                onSubmit={
                  selectedTask
                    ? updateTask
                    : createTask
                }
                onCancel={closeForm}
              />
            </section>
          )}

          <section className="tasks-section">
            <div className="tasks-header">
              <div>
                <h2>Your Tasks</h2>
                <p>
                  {filteredTasks.length} task
                  {filteredTasks.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="tasks-controls">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  className="task-search"
                />

                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(
                      event.target.value as FilterType
                    )
                  }
                  className="task-filter"
                >
                  <option value="all">All Tasks</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">
                    In Progress
                  </option>
                  <option value="completed">
                    Completed
                  </option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <p>Loading tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-tasks">
                <h3>No tasks found</h3>

                <p>
                  {search || filter !== "all"
                    ? "Try changing your search or filter."
                    : "Create your first task to get started."}
                </p>

                {!search && filter === "all" && (
                  <button
                    type="button"
                    onClick={handleCreateTask}
                    className="create-task-button"
                  >
                    + Create Task
                  </button>
                )}
              </div>
            ) : (
              <div className="tasks-grid">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;