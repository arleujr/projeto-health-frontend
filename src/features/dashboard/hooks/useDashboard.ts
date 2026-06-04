import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import { DashboardData } from '@/types/dashboard';

export function useDashboard() {
  const queryClient = useQueryClient();

  // Busca dos dados principais com cache de 5 minutos
  const dashboardQuery = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: dashboardService.getDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutos de staleTime conforme diretriz
  });

  // Mutação com Atualização Otimista (Optimistic Update)
  const attendMutation = useMutation({
    mutationFn: dashboardService.markAsAttended,
    
    onMutate: async (patientId) => {
      // Cancela refetches em andamento para não sobrescrever o estado temporário
      await queryClient.cancelQueries({ queryKey: ['dashboard-data'] });

      // Salva uma cópia do estado anterior caso precise dar Rollback
      const previousData = queryClient.getQueryData<DashboardData>(['dashboard-data']);

      // Atualiza o cache local imediatamente
      if (previousData) {
        queryClient.setQueryData<DashboardData>(['dashboard-data'], {
          ...previousData,
          // Remove o gatilho e joga o paciente para GREEN de forma instantânea na tela
          patients: previousData.patients.map((patient) =>
            patient.id === patientId 
              ? { ...patient, status: 'GREEN', trigger: null, aiAnalysis: undefined, aiMessage: undefined } 
              : patient
          ),
          metrics: {
            ...previousData.metrics,
            riskCount: Math.max(0, previousData.metrics.riskCount - 1),
          }
        });
      }

      // Retorna o contexto com o valor antigo
      return { previousData };
    },

    // Se o backend falhar, joga o dado antigo de volta na tela silenciosamente
    onError: (err, patientId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['dashboard-data'], context.previousData);
      }
    },

    // Sempre sincroniza com o banco no final (sucesso ou erro)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
    },
  });

  return {
    data: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    markAsAttended: attendMutation.mutate,
    isAttending: attendMutation.isPending,
  };
}