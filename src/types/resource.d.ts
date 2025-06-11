// src/types/resource.d.ts

export type ResourceType = 'video' | 'documento' | 'articulo' | 'audio' | 'otro';

export interface Resource {
  id: number;
  title: string;
  detail?: string;
  type_resource: ResourceType;
  url_resource?: string;
  created_by_user_email: string;
  created_at: string;
  updated_at: string;
}

export interface ResourcePayload {
  title: string;
  detail?: string;
  type_resource: ResourceType;
  url_resource?: string;
}