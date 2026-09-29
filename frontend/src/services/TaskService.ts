import api from "./api";

import type {
  Task,
  TaskPayload,
} from "../types/task";


export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
}


export const taskService = {

  async getAll(
    filters?: TaskFilters
  ): Promise<Task[]> {

    const response =
      await api.get(
        "/tasks/",
        {
          params: filters,
        }
      );

    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    }

    return data.results ?? [];
  },


  async getById(
    id: number
  ): Promise<Task> {

    const response =
      await api.get<Task>(
        `/tasks/${id}/`
      );

    return response.data;
  },


  async create(
    payload: TaskPayload
  ): Promise<Task> {

    const response =
      await api.post<Task>(
        "/tasks/",
        payload
      );

    return response.data;
  },


  async update(
    id: number,
    payload: Partial<TaskPayload>
  ): Promise<Task> {

    const response =
      await api.patch<Task>(
        `/tasks/${id}/`,
        payload
      );

    return response.data;
  },


  async remove(
    id: number
  ): Promise<void> {

    await api.delete(
      `/tasks/${id}/`
    );
  },
};