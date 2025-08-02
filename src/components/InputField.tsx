import React from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardTypeOptions,
} from "react-native";

export interface InputFieldProps {
  label: string;
  supportingText?: string;
  value?: string;
  secureTextEntry?: boolean;
  borderColor?: string;
  textColor?: string;
  trailingIcon?: string;
  hasFloatingLabel?: boolean;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  supportingText = "",
  value,
  secureTextEntry = false,
  borderColor = "#ffffff",
  textColor = "#ffffff",
  trailingIcon,
  hasFloatingLabel = false,
  onChangeText,
  keyboardType = "default",
  maxLength,
  placeholder,
  multiline = false,
  numberOfLines = 1,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { borderColor }]}>
        <View style={styles.content}>
          {hasFloatingLabel && value ? (
            <>
              <TextInput
                style={[styles.input, { color: "#18181b" }]}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                maxLength={maxLength}
                multiline={multiline}
                numberOfLines={numberOfLines}
              />
              <View style={styles.floatingLabel}>
                <Text style={styles.floatingLabelText}>{label}</Text>
              </View>
            </>
          ) : (
            <TextInput
              style={[
                styles.input, 
                { color: textColor },
                multiline && { minHeight: 24 * numberOfLines, textAlignVertical: 'top' }
              ]}
              placeholder={placeholder || label}
              placeholderTextColor={textColor}
              value={value}
              onChangeText={onChangeText}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              maxLength={maxLength}
              multiline={multiline}
              numberOfLines={numberOfLines}
            />
          )}
        </View>
        {trailingIcon && (
          <TouchableOpacity style={styles.trailingIconContainer}>
            <View style={styles.iconWrapper}>
              <Image
                source={{ uri: trailingIcon }}
                style={styles.trailingIcon}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
      {supportingText ? (
        <View style={styles.supportingTextContainer}>
          <Text style={styles.supportingText}>{supportingText}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    width: "100%",
    minHeight: 56,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 48,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 12,
    minHeight: 48,
  },
  input: {
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 24,
    padding: 0,
  },
  floatingLabel: {
    position: "absolute",
    top: -12,
    left: -4,
    backgroundColor: "#fdf2f8",
    paddingHorizontal: 4,
  },
  floatingLabelText: {
    fontSize: 12,
    letterSpacing: 0.4,
    lineHeight: 16,
    color: "#64748b",
  },
  trailingIconContainer: {
    width: 48,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(63, 63, 70, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  trailingIcon: {
    width: 24,
    height: 24,
  },
  supportingTextContainer: {
    position: "absolute",
    bottom: -20,
    left: 16,
    right: 16,
    height: 20,
  },
  supportingText: {
    fontSize: 12,
    letterSpacing: 0.4,
    lineHeight: 16,
    color: "#ffffff",
  },
});
