import { useQueryClient } from "@tanstack/react-query";
import {
  useGetDashboard,
  useListUsers,
  useGetUserDetail,
  useUpdateUser,
  useListEmails,
  useCreateEmail,
  useForwardEmail,
  useUpdateEmailStatus,
  useListTasks,
  useCreateTask,
  useGetLeaderboard,
  getGetDashboardQueryKey,
  getListUsersQueryKey,
  getGetUserDetailQueryKey,
  getListEmailsQueryKey,
  getListTasksQueryKey,
  getGetLeaderboardQueryKey
} from "@workspace/api-client-react";

// Wrapper hooks to automatically inject cache invalidation logic

export function useDashboard() {
  return useGetDashboard({
    query: {
      refetchInterval: 120000, // Auto-refresh every 2 mins
    }
  });
}

export function useUsers() {
  return useListUsers();
}

export function useUserDetail(id: number) {
  return useGetUserDetail(id);
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useUpdateUser({
    mutation: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: getGetUserDetailQueryKey(variables.id) });
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
      },
    }
  });
}

export function useEmails(date?: string, status?: any) {
  return useListEmails({ date, status });
}

export function useForwardEmailMutation() {
  const queryClient = useQueryClient();
  return useForwardEmail({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEmailsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
      }
    }
  });
}

export function useUpdateEmailStatusMutation() {
  const queryClient = useQueryClient();
  return useUpdateEmailStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEmailsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
      }
    }
  });
}

export function useTasks(date?: string) {
  return useListTasks({ date });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  return useCreateTask({
    mutation: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetUserDetailQueryKey(variables.data.user_id) });
      }
    }
  });
}

export function useLeaderboard(startDate?: string, endDate?: string) {
  return useGetLeaderboard({ startDate, endDate });
}
