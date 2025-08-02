import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from '../../components/StatusBar';
import { Button } from '../../components/Button';
import { ResponsiveContainer } from '../../components/ResponsiveContainer';
import { visitorService } from '../../utils/api';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type AdminScanQRScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminScanQR'>;

interface AdminScanQRScreenProps {
  navigation: AdminScanQRScreenNavigationProp;
}

export const AdminScanQRScreen: React.FC<AdminScanQRScreenProps> = ({ navigation }) => {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
    visitor?: any;
    resident?: any;
    errorDetails?: string;
  } | null>(null);

  const handleVerifyAccessCode = async (code: string) => {
    if (!code || code.length !== 4) {
      Alert.alert('Invalid Code', 'Please enter a valid 4-digit access code');
      return;
    }

    try {
      setLoading(true);
      console.log('Verifying access code:', code);
      const response = await visitorService.verifyAccessCode(code);
      console.log('Verification response:', JSON.stringify(response));
      
      if (response.success && response.visitor) {
        setVerificationResult({
          success: true,
          message: 'Access Granted',
          visitor: response.visitor,
          resident: response.visitor.resident
        });
      } else {
        setVerificationResult({
          success: false,
          message: response.message || 'Access Denied: Invalid or expired code',
          errorDetails: `Response: ${JSON.stringify(response)}`
        });
      }
    } catch (error: any) {
      console.error('Error verifying access code:', error);
      setVerificationResult({
        success: false,
        message: 'Verification failed. Please try again.',
        errorDetails: error.toString()
      });
    } finally {
      setLoading(false);
    }
  };

  const renderVerificationResult = () => {
    if (!verificationResult) return null;

    return (
      <View style={[
        styles.resultContainer, 
        { backgroundColor: verificationResult.success ? '#E6F4EA' : '#FBEAE9' }
      ]}>
        <Text style={[
          styles.resultTitle, 
          { color: verificationResult.success ? '#34A853' : '#EA4335' }
        ]}>
          {verificationResult.message}
        </Text>
        
        {verificationResult.success && verificationResult.visitor && (
          <>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Visitor Information</Text>
              <Text style={styles.infoText}>Name: {verificationResult.visitor.name || 'N/A'}</Text>
              <Text style={styles.infoText}>Purpose: {verificationResult.visitor.purpose || 'N/A'}</Text>
              <Text style={styles.infoText}>Phone: {verificationResult.visitor.phone || 'N/A'}</Text>
              <Text style={styles.infoText}>Email: {verificationResult.visitor.email || 'N/A'}</Text>
              <Text style={styles.infoText}>Access Code: {verificationResult.visitor.accessCode || 'N/A'}</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Resident Information</Text>
              <Text style={styles.infoText}>Name: {verificationResult.resident?.name || 'N/A'}</Text>
              <Text style={styles.infoText}>Apartment: {verificationResult.resident?.apartment || 'N/A'}</Text>
              <Text style={styles.infoText}>Phone: {verificationResult.resident?.phone || 'N/A'}</Text>
            </View>
          </>
        )}
        
        {!verificationResult.success && verificationResult.errorDetails && (
          <View style={styles.errorDetailsContainer}>
            <Text style={styles.errorDetailsTitle}>Error Details:</Text>
            <Text style={styles.errorDetailsText}>{verificationResult.errorDetails}</Text>
          </View>
        )}
        
        <Button 
          backgroundColor="#6750A4"
          textColor="#FFFFFF"
          onPress={() => setVerificationResult(null)}
        >
          Verify Another
        </Button>
      </View>
    );
  };

  return (
    <ResponsiveContainer>
      <View style={styles.container}>
        <StatusBar
          textColor="#1D1B20"
          signalIcon="https://api.builder.io/api/v1/image/assets/TEMP/fce6087025461d16dc8b5f927cf41cf5415b87da?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36"
          homeIcon="https://api.builder.io/api/v1/image/assets/TEMP/93d47d4b04a8df4b9c12bad2406c32f2b493ed92?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36"
        />
        
        <Text style={styles.title}>Verify Access</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6750A4" />
            <Text style={styles.loadingText}>Verifying...</Text>
          </View>
        ) : verificationResult ? (
          renderVerificationResult()
        ) : (
          <View style={styles.codeInputContainer}>
            <Text style={styles.inputDescription}>
              Enter the 4-digit access code provided by the visitor:
            </Text>
            
            <Image 
              source={{uri: 'https://api.builder.io/api/v1/image/assets/TEMP/93d47d4b04a8df4b9c12bad2406c32f2b493ed92?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36'}}
              style={styles.codeImage}
              resizeMode="contain"
            />
            
            <TextInput
              style={styles.codeInput}
              value={accessCode}
              onChangeText={setAccessCode}
              placeholder="0000"
              keyboardType="number-pad"
              maxLength={4}
              placeholderTextColor="#79747E"
            />
            
            <Button
              backgroundColor="#6750A4"
              textColor="#FFFFFF"
              onPress={() => handleVerifyAccessCode(accessCode)}
            >
              Verify Access
            </Button>
            
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('AdminDashboard')}
            >
              <Text style={styles.backButtonText}>Back to Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 20,
    textAlign: 'center',
  },
  codeInputContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  inputDescription: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#49454F',
  },
  codeImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  codeInput: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#79747E',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6750A4',
  },
  resultContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1D1B20',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#49454F',
  },
  errorDetailsContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  errorDetailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#B3261E',
  },
  errorDetailsText: {
    fontSize: 14,
    color: '#49454F',
  },
  backButton: {
    marginTop: 16,
    padding: 12,
  },
  backButtonText: {
    color: '#6750A4',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AdminScanQRScreen; 