import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from '../components/StatusBar';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { MaterialIcons } from '@expo/vector-icons';
import { emergencyService } from '../utils/api';

type EmergencyAlertScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EmergencyAlert'>;

interface EmergencyAlertScreenProps {
  navigation: EmergencyAlertScreenNavigationProp;
}

export const EmergencyAlertScreen: React.FC<EmergencyAlertScreenProps> = ({ navigation }) => {
  const [emergencyType, setEmergencyType] = useState('');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const emergencyTypes = [
    { value: 'fire', label: 'Fire Emergency', icon: 'local-fire-department', color: '#FF4444' },
    { value: 'medical', label: 'Medical Emergency', icon: 'medical-services', color: '#FF8800' },
    { value: 'security', label: 'Security Threat', icon: 'security', color: '#CC0000' },
    { value: 'maintenance', label: 'Maintenance Emergency', icon: 'build', color: '#FF6600' },
    { value: 'other', label: 'Other Emergency', icon: 'warning', color: '#FFAA00' },
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', color: '#4CAF50' },
    { value: 'medium', label: 'Medium Priority', color: '#FF9800' },
    { value: 'high', label: 'High Priority', color: '#F44336' },
    { value: 'critical', label: 'Critical', color: '#D32F2F' },
  ];

  const handleSubmitEmergency = async () => {
    if (!emergencyType || !description || !location) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const emergencyData = {
        type: emergencyType,
        priority,
        description,
        location
      };
      
      await emergencyService.createEmergencyAlert(emergencyData);
      setLoading(false);
      
      Alert.alert(
        'Emergency Alert Sent',
        'Your emergency alert has been sent to security personnel. They will respond shortly.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Dashboard')
          }
        ]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to send emergency alert. Please try again.');
      console.error('Error sending emergency alert:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar textColor="#000000" />
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Emergency Alert</Text>
          <Text style={styles.subtitle}>Report an emergency situation</Text>

          {/* Emergency Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Type *</Text>
            <View style={styles.typeGrid}>
              {emergencyTypes.map((type) => (
                <Button
                  key={type.value}
                  backgroundColor={emergencyType === type.value ? type.color : '#F5F5F5'}
                  textColor={emergencyType === type.value ? '#FFFFFF' : '#333333'}
                  onPress={() => setEmergencyType(type.value)}
                  style={styles.typeButton}
                >
                  <MaterialIcons 
                    name={type.icon} 
                    size={24} 
                    color={emergencyType === type.value ? '#FFFFFF' : type.color} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    { color: emergencyType === type.value ? '#FFFFFF' : '#333333' }
                  ]}>
                    {type.label}
                  </Text>
                </Button>
              ))}
            </View>
          </View>

          {/* Priority Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Priority Level</Text>
            <View style={styles.priorityGrid}>
              {priorities.map((priorityItem) => (
                <Button
                  key={priorityItem.value}
                  backgroundColor={priority === priorityItem.value ? priorityItem.color : '#F5F5F5'}
                  textColor={priority === priorityItem.value ? '#FFFFFF' : '#333333'}
                  onPress={() => setPriority(priorityItem.value)}
                  style={styles.priorityButton}
                >
                  {priorityItem.label}
                </Button>
              ))}
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <InputField
              label="Location *"
              value={location}
              onChangeText={setLocation}
              placeholder="e.g., Apartment 101, Building A, Parking Lot"
              borderColor="#79747E"
              textColor="#000000"
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <InputField
              label="Description *"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the emergency situation in detail..."
              borderColor="#79747E"
              textColor="#000000"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#FF4444" />
            ) : (
              <Button
                backgroundColor="#FF4444"
                textColor="#FFFFFF"
                onPress={handleSubmitEmergency}
                style={styles.emergencyButton}
              >
                <MaterialIcons name="warning" size={24} color="#FFFFFF" />
                <Text style={styles.emergencyButtonText}>Send Emergency Alert</Text>
              </Button>
            )}
          </View>

          {/* Back Button */}
          <View style={styles.backButtonContainer}>
            <Button
              backgroundColor="#F5F5F5"
              textColor="#333333"
              onPress={() => navigation.goBack()}
            >
              Cancel
            </Button>
          </View>
        </ScrollView>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeButton: {
    width: '48%',
    marginBottom: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  priorityButton: {
    width: '48%',
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  emergencyButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  emergencyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    marginTop: 16,
  },
}); 