import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { StatusBar } from "../components/StatusBar";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authService } from '../utils/api';
import { ResponsiveContainer } from "../components/ResponsiveContainer";

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
}

// Get screen dimensions
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
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
          Welcome {user?.name?.split(' ')[0] || 'Resident'},
        </Text>
        <Text style={styles.subtitle}>What do you want to do?</Text>
        
        {/* Action Cards */}
        <View style={styles.actionCardsContainer}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('RegisterVisitor')}
          >
            <View style={[styles.cardBackground, { backgroundColor: '#31111D' }]}>
              <Text style={styles.cardText}>Register Visitor</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('EmergencyAlert')}
          >
            <View style={[styles.cardBackground, { backgroundColor: '#B3261E' }]}>
              <Text style={styles.cardText}>Emergency Alert</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('MaintenanceRequest')}
          >
            <View style={[styles.cardBackground, { backgroundColor: '#1D192B' }]}>
              <Text style={styles.cardText}>Maintenance Request</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
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
});
