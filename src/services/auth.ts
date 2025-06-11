// src/services/auth.ts
import apiClient from './api';
import { AuthResponse, LoginCredentials, RegisterCredentials, UserCreationResponse } from '../types';


export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};

export const registerUser = async (credentials: RegisterCredentials): Promise<UserCreationResponse> => {
  try {
    const response = await apiClient.post<UserCreationResponse>('/auth/register', credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al registrar usuario');
  }
};

export const fetchUserProfile = async (): Promise<AuthResponse['user']> => {
  try {
    const response = await apiClient.get<AuthResponse['user']>('/auth/profile');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener perfil de usuario');
  }
};