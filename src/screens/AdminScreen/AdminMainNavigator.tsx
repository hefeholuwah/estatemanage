import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import Admin screens
import { AdminLoginScreen } from './AdminLoginScreen';
import { AdminVerifyAccessScreen } from './AdminVerifyAccessScreen';
import { AdminScanQRScreen } from './AdminScanQRScreen';
import { AdminEnterPINScreen } from './AdminEnterPINScreen';

// Admin stack navigator param list
export type AdminStackParamList = {
  AdminLogin: undefined;
  AdminVerifyAccess: undefined;
  AdminScanQR: undefined;
  AdminEnterPIN: undefined;
};

const AdminStack = createStackNavigator<AdminStackParamList>();

export const AdminMainNavigator = () => {
  return (
    <AdminStack.Navigator
      initialRouteName="AdminLogin"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        cardOverlayEnabled: true,
      }}
    >
      <AdminStack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <AdminStack.Screen 
        name="AdminVerifyAccess" 
        component={AdminVerifyAccessScreen}
        options={{ gestureEnabled: false }}
      />
      <AdminStack.Screen name="AdminScanQR" component={AdminScanQRScreen} />
      <AdminStack.Screen name="AdminEnterPIN" component={AdminEnterPINScreen} />
    </AdminStack.Navigator>
  );
}; 