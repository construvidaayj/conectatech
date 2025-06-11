import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api';

export const useGetFetchData = <T = unknown>(url: string, queryKey?: string) => {
  return useQuery<T>({
    queryKey: [queryKey || url],
    queryFn: async () => {
      const response = await apiClient.get<T>(url);
      return response.data;
    },
  });
};
