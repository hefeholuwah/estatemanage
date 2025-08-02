import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface StatusBarProps {
  textColor?: string;
  signalIcon?: string;
  homeIcon?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  textColor = "#ffffff",
  signalIcon = "https://api.builder.io/api/v1/image/assets/TEMP/a3c61de21d09003b5800b52937225670cb611698?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36",
  homeIcon = "https://api.builder.io/api/v1/image/assets/TEMP/ed0ed4468a4d5a582c9c6e4396e18007924dc5b9?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36",
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.time, { color: textColor }]}>9:30</Text>
      <Image
        source={{ uri: signalIcon }}
        style={styles.signalIcon}
        resizeMode="contain"
      />
      <Image
        source={{ uri: homeIcon }}
        style={styles.homeIcon}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 10,
    width: "100%",
    minHeight: 52,
    position: "relative",
  },
  time: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.25,
    lineHeight: 14,
  },
  signalIcon: {
    width: 46,
    height: 17,
  },
  homeIcon: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    marginLeft: -12,
    width: 24,
    height: 24,
  },
});
