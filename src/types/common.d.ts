// src/types/common.d.ts

//Respuesta de API con paginación o metadatos
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
  // Cualquier otro metadato que tu API devuelva
}

// Para definir un objeto con propiedades opcionales
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;