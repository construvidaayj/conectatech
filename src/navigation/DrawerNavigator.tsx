// src/navigation/DrawerNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MainDrawerParamList } from './types';

//Pantallas
import ContactsScreen from '../screens/main/ContactsScreen';
import ResourcesScreen from '../screens/main/ResourcesScreen';
import ContactFormScreen from '../screens/main/ContactFormScreen';
import ResourceFormScreen from '../screens/main/ResourceFormScreen';
import RegisterScreen from '../screens/main/RegisterScreen';
import CustomDrawerContent from './CustomDrawerContent';
import Icon from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

const DrawerNavigator: React.FC = () => {

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >

      <Drawer.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          title: 'Contactos',
          drawerIcon: ({ color, size }) => (
            <Icon name={'people-outline'} size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          title: 'Recursos Técnicos',
          drawerIcon: ({ color, size }) => (
            <Icon name={'library-outline'} size={size} color={color} />
          ),
        }}
      />


      <Drawer.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Crear Usuario',
          drawerIcon: ({ color, size }) => (
            <Icon name="person-add-outline" size={size} color={color} />
          )
        }}
      />

      <Drawer.Screen
        name="ContactForm"
        component={ContactFormScreen}
        options={{
          title: 'Crear Contacto',
          drawerIcon: ({ color, size }) => (
            <Icon name="person-add-outline" size={size} color={color} />
          ) 
        }}
      />

      <Drawer.Screen
        name="ResourceForm"
        component={ResourceFormScreen}
        options={{
          title: 'Crear Recurso Técnico',
          drawerIcon: ({ color, size }) => (
            <Icon name="person-add-outline" size={size} color={color} />
          )
        }}
      />

    </Drawer.Navigator>
  );
};

export default DrawerNavigator;