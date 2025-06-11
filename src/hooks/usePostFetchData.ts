import { useMutation } from '@tanstack/react-query';
import apiClient from '../services/api';

// T: tipo de la respuesta
// V: tipo del payload enviado
export const usePostFetchData = <T = unknown, V = unknown>(url: string) => {
  return useMutation<T, unknown, V>({
    mutationFn: async (data: V) => {
      const response = await apiClient.post<T>(url, data);
      return response.data;
    },
  });
};
