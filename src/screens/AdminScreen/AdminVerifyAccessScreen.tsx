import React, { useState } from "react";
import {
  View,
  Text,
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
import { MaterialIcons } from '@expo/vector-icons';

type AdminVerifyAccessScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminVerifyAccess'>;

interface AdminVerifyAccessScreenProps {
  navigation: AdminVerifyAccessScreenNavigationProp;
}

export const AdminVerifyAccessScreen: React.FC<AdminVerifyAccessScreenProps> = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyAccess = async () => {
    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'Please enter a 4-digit PIN');
      return;
    }

    setLoading(true);
    
    // Simulate verification process
    setTimeout(() => {
      setLoading(false);
      
      // For demo purposes, accept any 4-digit PIN
      if (pin === '1234' || pin === '0000' || pin === '9999') {
        Alert.alert(
          'Access Granted',
          'Welcome to Admin Dashboard',
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate('AdminDashboard')
            }
          ]
        );
      } else {
        Alert.alert('Access Denied', 'Invalid PIN. Please try again.');
      }
    }, 1500);
  };

  const handleBackToLogin = () => {
    navigation.navigate('AdminLogin');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar textColor="#000000" />
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="security" size={80} color="#FF9800" />
          </View>
          
          <Text style={styles.title}>Security Verification</Text>
          <Text style={styles.subtitle}>Enter your 4-digit security PIN</Text>
          
          <View style={styles.pinContainer}>
            <InputField
              label="Security PIN"
              value={pin}
              onChangeText={setPin}
              borderColor="#FF9800"
              textColor="#000000"
            />
          </View>
          
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#FF9800" />
            ) : (
              <Button
                backgroundColor="#FF9800"
                textColor="#FFFFFF"
                onPress={handleVerifyAccess}
              >
                Verify Access
              </Button>
            )}
          </View>
          
          <View style={styles.backButtonContainer}>
            <Button
              backgroundColor="#F5F5F5"
              textColor="#333333"
              onPress={handleBackToLogin}
            >
              Back to Login
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  pinContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  backButtonContainer: {
    marginTop: 20,
  },
}); 