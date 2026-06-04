import { api } from '@/lib/pi-client';
import { DashboardData } from '@/types/dashboard';

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    const response = await api.get<DashboardData>('/v1/plans/dashboard');
    return response.data;
  },

  // Endpoint para marcar o alerta do paciente como resolvido/atendido
  markAsAttended: async (patientId: string): Promise<void> => {
    await api.post(`/v1/plans/patients/${patientId}/attend`);
  }
};