import React from "react";
import { StatusBar } from "expo-status-bar";
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
    <>
      <AppNavigator />
      <StatusBar style="light" />
    </>
  );
}
