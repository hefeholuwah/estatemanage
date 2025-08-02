import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet, ViewStyle, TextStyle } from "react-native";

export interface ButtonProps {
  children: React.ReactNode;
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  backgroundColor = "#ffffff",
  textColor = "#0f172a",
  onPress,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.container, style]}
      activeOpacity={0.7}
    >
      <View style={[styles.content, { backgroundColor }]}>
        <View style={styles.stateLayer}>
          {icon && (
            <Image
              source={{ uri: icon }}
              style={styles.icon}
              resizeMode="contain"
            />
          )}
          <Text style={[styles.label, { color: textColor }, textStyle]}>
            {children}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  stateLayer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.1,
    lineHeight: 24,
  },
});
