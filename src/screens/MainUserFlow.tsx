import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { LoginScreen } from "./LoginScreen";
import { ChangePasswordScreen } from "./ChangePasswordScreen";
import { DashboardScreen } from "./DashboardScreen";
import { RegisterVisitorScreen } from "./RegisterVisitorScreen";
import { QRCodeScreen } from "./QRCodeScreen";
import { SuccessScreen } from "./SuccessScreen";

function MainUserFlow() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <LoginScreen />
        <ChangePasswordScreen />
        <DashboardScreen />
        <RegisterVisitorScreen />
        <QRCodeScreen />
        <SuccessScreen />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginHorizontal: "auto",
    width: "100%",
    maxWidth: 480,
    paddingHorizontal: 16,
  },
});

export default MainUserFlow;
