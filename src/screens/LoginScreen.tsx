import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "../components/StatusBar";
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authService } from '../utils/api';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!userId || !password) {
      Alert.alert('Login Failed', 'Please enter your User ID and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await authService.login(userId, password);
      
      if (!response.success) {
        setLoading(false);
        setError(response.message || 'Login failed. Please try again.');
        Alert.alert('Login Failed', response.message || 'Invalid credentials. Please try again.');
        return;
      }
      
      setLoading(false);
      
      // Check user role to navigate to appropriate screen
      if (response.user && response.user.role === 'security') {
        navigation.navigate('AdminDashboard');
      } else if (response.user) {
        navigation.navigate('Dashboard');
      } else {
        // Handle unexpected response without user data
        setError('Login error: Invalid user data received');
        Alert.alert('Login Failed', 'Invalid user data received. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setLoading(false);
      const errorMessage = err.response?.data?.message || err.message || 'Invalid credentials. Please try again.';
      setError(errorMessage);
      Alert.alert('Login Failed', errorMessage);
    }
  };

  const handleBackToMain = () => {
    navigation.navigate('MainEntry');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ImageBackground
          source={{
            uri: "https://api.builder.io/api/v1/image/assets/TEMP/bdfd801283f0b5e53a21a6843a8d386c73da0af6?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36",
          }}
          style={styles.background}
          resizeMode="cover"
        >
          <StatusBar textColor="#ffffff" />
          <View style={styles.content}>
            <Text style={styles.title}>EstateOne</Text>
            <Text style={styles.subtitle}>Resident Access Portal</Text>
            
            <View style={styles.formContainer}>
              <InputField 
                label="User ID" 
                value={userId}
                onChangeText={setUserId}
                borderColor="#ffffff"
                textColor="#ffffff"
              />
              
              <InputField 
                label="Password" 
                value={password}
                onChangeText={setPassword}
                secureTextEntry 
                borderColor="#ffffff"
                textColor="#ffffff"
              />
              
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
            
            <View style={styles.buttonContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#ffffff" />
              ) : (
                <Button 
                  backgroundColor="#004080"
                  textColor="#ffffff"
                  onPress={handleLogin}
                >
                  Resident Login
                </Button>
              )}
            </View>

            <View style={styles.backButtonContainer}>
              <Button 
                backgroundColor="transparent"
                textColor="#ffffff"
                onPress={handleBackToMain}
              >
                Back to Main Menu
              </Button>
            </View>
          </View>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.9,
  },
  formContainer: {
    marginBottom: 30,
  },
  errorText: {
    color: '#ff0000',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    alignSelf: "center",
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
  },
  backButtonContainer: {
    marginTop: 20,
    alignSelf: "center",
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  handle: {
    width: 108,
    height: 4,
    backgroundColor: "#ffffff",
    borderRadius: 12,
  },
});
