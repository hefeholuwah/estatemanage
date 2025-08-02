import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { StatusBar } from "../../components/StatusBar";
import { InputField } from "../../components/InputField";
import { Button } from "../../components/Button";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { MaterialIcons } from '@expo/vector-icons';
import { authService } from '../../utils/api';
import { ResponsiveContainer } from '../../components/ResponsiveContainer';

type AdminDashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminDashboard'>;

interface AdminDashboardScreenProps {
  navigation: AdminDashboardScreenNavigationProp;
}

interface User {
  id: string;
  name: string;
  userId: string;
  apartment: string;
  role: string;
}

// Get screen dimensions
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ navigation }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    password: '',
    apartment: '',
    role: 'resident'
  });

  useEffect(() => {
    checkAuthAndLoadUsers();
  }, []);

  const checkAuthAndLoadUsers = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const user = await authService.getCurrentUser();
      if (!user || user.role !== 'security') {
        Alert.alert('Access Denied', 'Please login as security staff');
        navigation.navigate('AdminLogin');
        return;
      }
      
      setCurrentUser(user);
      
      // Load users
      const response = await authService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Connection Error', 'Unable to load users. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!formData.name || !formData.userId || !formData.password || !formData.apartment) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    try {
      setCreatingUser(true);
      await authService.createUser(formData);
      setShowCreateModal(false);
      setFormData({ name: '', userId: '', password: '', apartment: '', role: 'resident' });
      loadUsers();
      Alert.alert('Success', 'User created successfully');
    } catch (error: any) {
      console.error('Error creating user:', error);
      const errorMessage = error.message || 'Failed to create user. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setCreatingUser(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await authService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users. Please try again.');
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.deleteUser(userId);
              loadUsers();
              Alert.alert('Success', 'User deleted successfully');
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user. Please try again.');
            }
          }
        }
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'resident': return '#4CAF50';
      case 'security': return '#FF9800';
      case 'maintenance': return '#2196F3';
      default: return '#666666';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'resident': return 'person';
      case 'security': return 'security';
      case 'maintenance': return 'build';
      default: return 'person';
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await authService.logout();
              navigation.navigate('MainEntry');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <ResponsiveContainer scrollable={false}>
      <View style={styles.container}>
        <StatusBar
          textColor="#1D1B20"
          signalIcon="https://api.builder.io/api/v1/image/assets/TEMP/fce6087025461d16dc8b5f927cf41cf5415b87da?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36"
          homeIcon="https://api.builder.io/api/v1/image/assets/TEMP/93d47d4b04a8df4b9c12bad2406c32f2b493ed92?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36"
        />
        
        {/* Avatar */}
        <Image
          source={{
            uri: "https://api.builder.io/api/v1/image/assets/TEMP/34fefe316535e2b54e24b1ceb5d47e0e8d80a22d?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36",
          }}
          style={styles.avatar}
          resizeMode="contain"
        />
        
        {/* Welcome Text */}
        <Text style={styles.welcome}>
          {currentUser ? `Welcome ${currentUser.name.split(' ')[0]},` : 'Welcome Security,'}
        </Text>
        <Text style={styles.subtitle}>What do you want to do?</Text>
        
        {/* Action Cards */}
        <View style={styles.actionCardsContainer}>
          <TouchableOpacity 
            key="verify-access"
            style={styles.actionCard}
            onPress={() => navigation.navigate('AdminScanQR')}
          >
            <View style={[styles.cardBackground, { backgroundColor: '#31111D' }]}>
              <Text style={styles.cardText}>Verify Access</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            key="emergency-response"
            style={styles.actionCard}
            onPress={() => navigation.navigate('AdminScanQR')}
          >
            <View style={[styles.cardBackground, { backgroundColor: '#B3261E' }]}>
              <Text style={styles.cardText}>Emergency Response</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            key="create-user"
            style={styles.actionCard}
            onPress={() => setShowCreateModal(true)}
          >
            <View style={[styles.cardBackground, { backgroundColor: '#1D192B' }]}>
              <Text style={styles.cardText}>Create User</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            key="logout"
            style={styles.actionCard}
            onPress={handleLogout}
          >
            <View style={[styles.cardBackground, { backgroundColor: '#6750A4' }]}>
              <Text style={styles.cardText}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Navigation Handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
      </View>

      {/* Create User Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New User</Text>
            
            <InputField
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              borderColor="#79747E"
              textColor="#000000"
            />
            
            <InputField
              label="User ID"
              value={formData.userId}
              onChangeText={(text) => setFormData({ ...formData, userId: text })}
              borderColor="#79747E"
              textColor="#000000"
            />
            
            <InputField
              label="Password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              borderColor="#79747E"
              textColor="#000000"
              secureTextEntry
            />
            
            <InputField
              label="Apartment"
              value={formData.apartment}
              onChangeText={(text) => setFormData({ ...formData, apartment: text })}
              borderColor="#79747E"
              textColor="#000000"
            />
            
            <View style={styles.roleSelection}>
              <Text style={styles.roleLabel}>Role:</Text>
              <View style={styles.roleButtons}>
                {['resident', 'security', 'maintenance'].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleButton,
                      formData.role === role && { backgroundColor: getRoleColor(role) }
                    ]}
                    onPress={() => setFormData({ ...formData, role })}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      formData.role === role && { color: '#FFFFFF' }
                    ]}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <Button
                backgroundColor="#F5F5F5"
                textColor="#333333"
                onPress={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              
              <Button
                backgroundColor="#4CAF50"
                textColor="#FFFFFF"
                onPress={handleCreateUser}
              >
                {creatingUser ? 'Creating...' : 'Create User'}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  avatar: {
    width: screenWidth * 0.35,
    height: screenWidth * 0.35,
    position: 'absolute',
    top: screenHeight * 0.08,
    left: screenWidth * 0.1,
  },
  welcome: {
    position: 'absolute',
    width: '80%',
    top: screenHeight * 0.25,
    left: screenWidth * 0.1,
    fontFamily: 'Raleway',
    fontWeight: "500",
    fontSize: screenWidth * 0.12,
    lineHeight: screenWidth * 0.14,
    letterSpacing: 0.01,
    color: "#061123",
  },
  subtitle: {
    position: 'absolute',
    top: screenHeight * 0.4,
    left: screenWidth * 0.1,
    fontFamily: 'Raleway',
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.01,
    color: "#061123",
  },
  actionCardsContainer: {
    position: 'absolute',
    top: screenHeight * 0.45,
    left: 0,
    right: 0,
    bottom: 30,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  actionCard: {
    height: '22%',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
    marginBottom: 10,
  },
  cardBackground: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
  },
  cardText: {
    marginLeft: 20,
    fontFamily: 'BricolageGrotesque_400Regular',
    fontSize: 24,
    lineHeight: 24,
    letterSpacing: 0.01,
    color: '#FFFFFF',
  },
  handleContainer: {
    position: 'absolute',
    height: 24,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handle: {
    width: 108,
    height: 4,
    backgroundColor: "#1D1B20",
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  roleSelection: {
    marginVertical: 16,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
}); 