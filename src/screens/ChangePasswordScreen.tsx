import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
} from "react-native";
import { StatusBar } from "../components/StatusBar";
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ChangePasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChangePassword'>;

interface ChangePasswordScreenProps {
  navigation: ChangePasswordScreenNavigationProp;
}

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        <ImageBackground
          source={{
            uri: "https://api.builder.io/api/v1/image/assets/TEMP/bdfd801283f0b5e53a21a6843a8d386c73da0af6?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36",
          }}
          style={styles.background}
          resizeMode="cover"
        >
          <StatusBar signalIcon="https://api.builder.io/api/v1/image/assets/TEMP/05140c4e5ad6d1506361a146377f919a066577a5?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36" />
          <Text style={styles.title}>EstateOne</Text>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.subtitle}>Set Your Password</Text>
            <InputField label="New Password" secureTextEntry />
            <InputField label="Confirm" secureTextEntry />
            <View style={styles.buttonContainer}>
              <Button 
                icon="https://api.builder.io/api/v1/image/assets/TEMP/0292c75633ba19790b442c8ccdb95cbdaaa2fd5d?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36"
                onPress={() => navigation.navigate('Dashboard')}
              >
                Continue
              </Button>
            </View>
            <View style={styles.handle} />
          </ScrollView>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 8,
    borderColor: "#a8a29e",
    overflow: "hidden",
    backgroundColor: "var(--sds-color-background-brand-secondary)",
    marginTop: 48,
  },
  screenContainer: {
    width: "100%",
    aspectRatio: 0.462,
  },
  background: {
    flex: 1,
  },
  title: {
    alignSelf: "center",
    marginTop: 112,
    fontSize: 36,
    letterSpacing: 0.5,
    lineHeight: 36,
    color: "#ffffff",
    textDecorationLine: "underline",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 112,
  },
  subtitle: {
    alignSelf: "flex-start",
    fontSize: 24,
    letterSpacing: 0.5,
    lineHeight: 24,
    color: "#ffffff",
  },
  buttonContainer: {
    alignSelf: "center",
    marginTop: 176,
  },
  handle: {
    alignSelf: "center",
    marginTop: 144,
    height: 4,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    width: 108,
  },
});
