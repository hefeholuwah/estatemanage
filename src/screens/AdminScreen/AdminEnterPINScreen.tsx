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
import { Button } from "../../components/Button";
import { InputField } from "../../components/InputField";
import { StackNavigationProp } from '@react-navigation/stack';
import { AdminStackParamList } from './AdminMainNavigator'; 
import { visitorService } from '../../utils/api';
import { logService } from '../../utils/api';

type AdminEnterPINScreenNavigationProp = StackNavigationProp<AdminStackParamList, 'AdminEnterPIN'>;

interface AdminEnterPINScreenProps {
  navigation: AdminEnterPINScreenNavigationProp;
}

export const AdminEnterPINScreen: React.FC<AdminEnterPINScreenProps> = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState<any>(null);
  
  const verifyAccessCode = async () => {
    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'Please enter a 4-digit PIN');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await visitorService.verifyAccessCode(pin);
      
      // Create access log
      await logService.createLog({
        visitor: response.data.visitor._id,
        accessCode: pin,
        accessMethod: 'pin-entry',
        status: 'granted'
      });
      
      setVisitorInfo(response.data);
      setVerificationSuccess(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Invalid or expired access code');
      Alert.alert('Verification Failed', 'Invalid or expired access code');
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar textColor="#000000" />
        <View style={styles.content}>
          <Text style={styles.title}>Enter Access PIN</Text>
          
          {!verificationSuccess ? (
            <>
              <InputField 
                label="PIN Code" 
                value={pin}
                onChangeText={setPin}
                keyboardType="numeric"
                maxLength={4}
                borderColor="#79747E"
                textColor="#000000"
                supportingText="Please enter the 4-digit PIN from the visitor's access code"
              />
              
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              <View style={styles.buttonContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color="#004080" />
                ) : (
                  <Button 
                    backgroundColor="#004080"
                    textColor="#ffffff"
                    onPress={verifyAccessCode}
                    icon="https://api.builder.io/api/v1/image/assets/TEMP/9f69b54c19e9f6fa38a4ac4a1659fe9bfb4b8a04?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36"
                  >
                    Verify Access
                  </Button>
                )}
              </View>
            </>
          ) : (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Access Granted</Text>
              
              <View style={styles.visitorInfoCard}>
                <Text style={styles.infoLabel}>Visitor Name:</Text>
                <Text style={styles.infoValue}>{visitorInfo?.visitor?.name}</Text>
                
                <Text style={styles.infoLabel}>Visiting:</Text>
                <Text style={styles.infoValue}>
                  {visitorInfo?.resident?.name}, Apt {visitorInfo?.resident?.apartment}
                </Text>
                
                <Text style={styles.infoLabel}>Visit Date/Time:</Text>
                <Text style={styles.infoValue}>
                  {new Date(visitorInfo?.visitor?.visitDate).toLocaleDateString()} at {visitorInfo?.visitor?.visitTime}
                </Text>
              </View>
              
              <View style={styles.successButtonContainer}>
                <Button 
                  backgroundColor="#004080"
                  textColor="#ffffff"
                  onPress={() => setVerificationSuccess(false)}
                >
                  Verify Another Code
                </Button>
              </View>
            </View>
          )}
          
          <View style={styles.secondaryButtonContainer}>
            <Button 
              backgroundColor="#f2f2f2"
              textColor="#003366"
              onPress={() => navigation.goBack()}
            >
              Cancel
            </Button>
          </View>
        </View>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 30,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    alignSelf: "center",
    width: '100%',
    marginBottom: 20,
    marginTop: 40,
    minHeight: 56,
    justifyContent: 'center',
  },
  secondaryButtonContainer: {
    alignSelf: "center",
    width: '100%',
    marginTop: 16,
  },
  successContainer: {
    width: '100%',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  visitorInfoCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 16,
  },
  successButtonContainer: {
    width: '100%',
    marginTop: 16,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  handle: {
    width: 108,
    height: 4,
    backgroundColor: "#1D1B20",
    borderRadius: 12,
  },
}); 