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
import { maintenanceService } from '../utils/api';

type MaintenanceRequestScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MaintenanceRequest'>;

interface MaintenanceRequestScreenProps {
  navigation: MaintenanceRequestScreenNavigationProp;
}

export const MaintenanceRequestScreen: React.FC<MaintenanceRequestScreenProps> = ({ navigation }) => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'plumbing', label: 'Plumbing', icon: 'plumbing', color: '#2196F3' },
    { value: 'electrical', label: 'Electrical', icon: 'electrical-services', color: '#FF9800' },
    { value: 'hvac', label: 'HVAC', icon: 'ac-unit', color: '#4CAF50' },
    { value: 'appliance', label: 'Appliance', icon: 'kitchen', color: '#9C27B0' },
    { value: 'structural', label: 'Structural', icon: 'home-repair-service', color: '#795548' },
    { value: 'pest-control', label: 'Pest Control', icon: 'bug-report', color: '#8BC34A' },
    { value: 'cleaning', label: 'Cleaning', icon: 'cleaning-services', color: '#00BCD4' },
    { value: 'other', label: 'Other', icon: 'build', color: '#607D8B' },
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', color: '#4CAF50' },
    { value: 'medium', label: 'Medium Priority', color: '#FF9800' },
    { value: 'high', label: 'High Priority', color: '#F44336' },
    { value: 'urgent', label: 'Urgent', color: '#D32F2F' },
  ];

  const handleSubmitRequest = async () => {
    if (!category || !title || !description || !location) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const maintenanceData = {
        category,
        title,
        description,
        location,
        priority
      };
      
      await maintenanceService.createMaintenanceRequest(maintenanceData);
      setLoading(false);
      
      Alert.alert(
        'Request Submitted',
        'Your maintenance request has been submitted. Maintenance staff will review and respond shortly.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Dashboard')
          }
        ]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to submit maintenance request. Please try again.');
      console.error('Error submitting maintenance request:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar textColor="#000000" />
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Maintenance Request</Text>
          <Text style={styles.subtitle}>Report a maintenance issue</Text>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category *</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <View key={cat.value} style={styles.categoryButton}>
                  <Button
                    backgroundColor={category === cat.value ? cat.color : '#F5F5F5'}
                    textColor={category === cat.value ? '#FFFFFF' : '#333333'}
                    onPress={() => setCategory(cat.value)}
                  >
                    <MaterialIcons 
                      name={cat.icon} 
                      size={24} 
                      color={category === cat.value ? '#FFFFFF' : cat.color} 
                    />
                    <Text style={[
                      styles.categoryButtonText,
                      { color: category === cat.value ? '#FFFFFF' : '#333333' }
                    ]}>
                      {cat.label}
                    </Text>
                  </Button>
                </View>
              ))}
            </View>
          </View>

          {/* Title */}
          <View style={styles.section}>
            <InputField
              label="Title *"
              value={title}
              onChangeText={setTitle}
              borderColor="#79747E"
              textColor="#000000"
            />
          </View>

          {/* Location */}
          <View style={styles.section}>
            <InputField
              label="Location *"
              value={location}
              onChangeText={setLocation}
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
              borderColor="#79747E"
              textColor="#000000"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Priority Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Priority Level</Text>
            <View style={styles.priorityGrid}>
              {priorities.map((priorityItem) => (
                <View key={priorityItem.value} style={styles.priorityButton}>
                  <Button
                    backgroundColor={priority === priorityItem.value ? priorityItem.color : '#F5F5F5'}
                    textColor={priority === priorityItem.value ? '#FFFFFF' : '#333333'}
                    onPress={() => setPriority(priorityItem.value)}
                  >
                    {priorityItem.label}
                  </Button>
                </View>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#2196F3" />
            ) : (
              <Button
                backgroundColor="#2196F3"
                textColor="#FFFFFF"
                onPress={handleSubmitRequest}
              >
                Submit Request
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    marginBottom: 12,
  },
  categoryButtonText: {
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
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  backButtonContainer: {
    marginTop: 16,
  },
}); 