// src/navigation/types.ts
import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
};

export type MainDrawerParamList = {
  Contacts: undefined;
  Resources: undefined;
  Register: undefined;
  ContactForm: { contactId?: number } | undefined;
  ResourceForm: { resourceId?: number } | undefined;
};

export type AppStackParamList = {
 
  MainDrawer: NavigatorScreenParams<MainDrawerParamList>;
 
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
