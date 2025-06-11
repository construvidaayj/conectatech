// src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStackParamList } from './types';
import DrawerNavigator from './DrawerNavigator';

const AppStack = createStackNavigator<AppStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="MainDrawer" component={DrawerNavigator} />
    </AppStack.Navigator>
  );
};

export default AppNavigator;