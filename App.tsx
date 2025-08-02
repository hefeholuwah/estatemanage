import React from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { AppNavigator } from "./src/navigation/AppNavigator";
import {
  useFonts,
  Raleway_300Light,
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import {
  BricolageGrotesque_400Regular,
} from "@expo-google-fonts/bricolage-grotesque";
import {
  Roboto_500Medium,
} from "@expo-google-fonts/roboto";
import 'react-native-gesture-handler';
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  let [fontsLoaded] = useFonts({
    Raleway_300Light,
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    BricolageGrotesque_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AppNavigator />
      <ExpoStatusBar style="light" />
    </AuthProvider>
  );
} 