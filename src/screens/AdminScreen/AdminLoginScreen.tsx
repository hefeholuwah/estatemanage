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
import { StatusBar } from "../../components/StatusBar";
import { InputField } from "../../components/InputField";
import { Button } from "../../components/Button";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { authService } from '../../utils/api';

type AdminLoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminLogin'>;

interface AdminLoginScreenProps {
  navigation: AdminLoginScreenNavigationProp;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userId || !password) {
      Alert.alert('Missing Information', 'Please enter both Security ID and Password');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(userId, password);
      
      // Check if user is security staff
      if (response.user.role !== 'security') {
        Alert.alert('Access Denied', 'Only security staff can access admin features');
        setLoading(false);
        return;
      }

      setLoading(false);
      // Navigate directly to AdminDashboard after successful login
      navigation.navigate('AdminDashboard');
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Failed', 'Invalid Security ID or Password');
      console.error('Login error:', error);
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
            <Text style={styles.title}>EstateOne Security</Text>
            <Text style={styles.subtitle}>Admin Access Portal</Text>
            
            <View style={styles.formContainer}>
              <InputField 
                label="Security ID" 
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
                  Security Login
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
    backgroundColor: '#003366',
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