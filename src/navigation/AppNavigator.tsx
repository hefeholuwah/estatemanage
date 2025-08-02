import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import regular screens
import { LoginScreen } from '../screens/LoginScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { RegisterVisitorScreen } from '../screens/RegisterVisitorScreen';
import { QRCodeScreen } from '../screens/QRCodeScreen';
import { SuccessScreen } from '../screens/SuccessScreen';
import { MainEntryScreen } from '../screens/MainEntryScreen';
import { EmergencyAlertScreen } from '../screens/EmergencyAlertScreen';
import { MaintenanceRequestScreen } from '../screens/MaintenanceRequestScreen';

// Import admin screens
import { AdminLoginScreen } from '../screens/AdminScreen/AdminLoginScreen';
import { AdminScanQRScreen } from '../screens/AdminScreen/AdminScanQRScreen';
import { AdminEnterPINScreen } from '../screens/AdminScreen/AdminEnterPINScreen';
import { AdminDashboardScreen } from '../screens/AdminScreen/AdminDashboardScreen';

// Define the stack navigator param list types
export type RootStackParamList = {
  // Entry point
  MainEntry: undefined;
  
  // Resident screens
  Login: undefined;
  ChangePassword: undefined;
  Dashboard: undefined;
  RegisterVisitor: undefined;
  QRCode: undefined;
  Success: undefined;
  EmergencyAlert: undefined;
  MaintenanceRequest: undefined;
  
  // Admin screens
  AdminLogin: undefined;
  AdminScanQR: undefined;
  AdminEnterPIN: undefined;
  AdminDashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainEntry"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardOverlayEnabled: true,
        }}
        id="RootNavigator"
      >
        {/* Entry Point */}
        <Stack.Screen name="MainEntry" component={MainEntryScreen} />
        
        {/* Resident Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen 
          name="ChangePassword" 
          component={ChangePasswordScreen} 
          options={{ gestureEnabled: false }} 
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="RegisterVisitor" component={RegisterVisitorScreen} />
        <Stack.Screen name="QRCode" component={QRCodeScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="EmergencyAlert" component={EmergencyAlertScreen} />
        <Stack.Screen name="MaintenanceRequest" component={MaintenanceRequestScreen} />
        
        {/* Security Admin Screens */}
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminScanQR" component={AdminScanQRScreen} />
        <Stack.Screen name="AdminEnterPIN" component={AdminEnterPINScreen} />
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboardScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 