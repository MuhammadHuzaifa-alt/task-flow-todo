import api from "./api";


export interface DashboardStats {

  total: number;

  completed: number;

  in_progress: number;

  todo: number;

  high_priority: number;

  completion_percentage: number;
}


export const dashboardService = {

  async getStats(): Promise<DashboardStats> {

    const response =
      await api.get<DashboardStats>(
        "/dashboard/stats/"
      );

    return response.data;
  },
};