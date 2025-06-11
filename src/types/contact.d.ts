// src/types/contact.d.ts

export interface Vehicle {
  id: number;
  plate: string;
  type: string;
}

export interface ContactNumber {
  id: number;
  numero: string;
}

export interface Contact {
  id: number;
  full_name: string;
  boss_name: string;
  position: string;
  vehicle?: Vehicle;
  contact_numbers?: ContactNumber[]; // Array de números de contacto
  created_by_user_id: number;
  created_at: string; // O Date, dependiendo de cómo lo manejes
  updated_at: string;
}

export interface ContactPayload {
  full_name: string;
  boss_name: string;
  position: string;
  vehicle_plate?: string; // Para enviar la placa al crear/actualizar
  vehicle_type?: string; // Para enviar el tipo de vehículo al crear/actualizar
  contact_numbers?: string[]; // Array de strings de números para enviar
}