// src/types/auth.d.ts

// Define la estructura del usuario tal como la devuelve tu API
export interface User {
  id: number;
  email: string;
  role: 'maestro' | 'supervisor' | 'normal'; // Los roles que definiste en tu DB
  nombre?: string;
  apellido?: string;
}

// Define la estructura de la respuesta de login/registro de tu API
export interface AuthResponse {
  user: User;
  token: string; // El JWT que tu API genera y devuelve
}

// Define la estructura de las credenciales de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Define la estructura de las credenciales de registro
export interface RegisterCredentials extends LoginCredentials {
  nombre?: string;
  apellido?: string;
  role: 'maestro' | 'supervisor' | 'normal'; // El rol que se asignará al nuevo usuario
}