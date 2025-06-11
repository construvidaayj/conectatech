import { User } from "./auth";

export type UserCreationResponse = {
  success: boolean; 
  message?: string; 
  user?: User;
};