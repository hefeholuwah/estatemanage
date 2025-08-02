import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from "../components/StatusBar";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { MaterialIcons } from '@expo/vector-icons';
import { ResponsiveContainer } from "../components/ResponsiveContainer";

type SuccessScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Success'>;

interface SuccessScreenProps {
  navigation: SuccessScreenNavigationProp;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ navigation }) => {
  return (
    <ResponsiveContainer scrollable={false}>
      <View style={styles.contentContainer}>
        <StatusBar
          textColor="#1D1B20"
          signalIcon="https://api.builder.io/api/v1/image/assets/TEMP/2d2b4f8c65ce1fc5dd9c511eb41beeb36db4f29f?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36"
          homeIcon="https://api.builder.io/api/v1/image/assets/TEMP/93d47d4b04a8df4b9c12bad2406c32f2b493ed92?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36"
        />
        
        {/* User Profile Card */}
        <View style={styles.profileCardContainer}>
          <View style={styles.profileCard}>
            <Image 
              source={{ uri: "https://via.placeholder.com/524x931/31111D" }} 
              style={styles.backgroundImage} 
            />
            <Text style={styles.userName}>Ayomide,</Text>
            <Text style={styles.apartmentNumber}>Apt 001</Text>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: "https://via.placeholder.com/121/31111D" }} 
                style={styles.avatar} 
              />
            </View>
          </View>
        </View>

        <Text style={styles.description}>
          Access code generated for guests will expire after 30 minutes
        </Text>
        <Text style={styles.title}>Shared Successfully</Text>

        <View style={styles.illustrationContainer}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/8028/8028211.png" }}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('Dashboard')}
        >
          <View style={styles.buttonContent}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
            <Text style={styles.buttonLabel}>Back to Dashboard</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.handle} />
      </View>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  profileCardContainer: {
    position: "absolute",
    width: '95%',
    height: 140,
    left: '2.5%',
    top: 76,
    zIndex: 1,
  },
  profileCard: {
    width: '100%',
    height: 140,
    backgroundColor: "#31111D",
    borderWidth: 0.5,
    borderColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    position: 'relative',
  },
  backgroundImage: {
    position: "absolute",
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    opacity: 0.7,
  },
  userName: {
    position: "absolute",
    left: 20,
    top: 40,
    fontFamily: "Raleway_500Medium",
    fontWeight: "500",
    fontSize: 32,
    color: "#FFFFFF",
  },
  apartmentNumber: {
    position: "absolute",
    left: 20,
    top: 80,
    fontFamily: "Raleway_400Regular",
    fontWeight: "400",
    fontSize: 20,
    color: "#FFFFFF",
  },
  avatarContainer: {
    position: "absolute",
    width: 80,
    height: 80,
    right: 20,
    top: 30,
    borderRadius: 40,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  description: {
    position: "absolute",
    width: '80%',
    left: 16,
    top: 240,
    fontFamily: "Raleway_300Light",
    fontWeight: "300",
    fontSize: 12,
    lineHeight: 15,
    color: "#000000",
  },
  title: {
    position: "absolute",
    width: '80%',
    left: 16,
    top: 270,
    fontFamily: "Raleway_400Regular",
    fontWeight: "400",
    fontSize: 24,
    color: "#000000",
  },
  illustrationContainer: {
    position: "absolute",
    width: '90%',
    height: '40%',
    left: '5%',
    top: '40%',
    backgroundColor: "#F8F9FF",
    borderWidth: 0.5,
    borderColor: "#CAC4D0",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationImage: {
    width: "80%",
    height: "80%",
    tintColor: "#64FCD9",
  },
  backButton: {
    position: "absolute",
    width: '60%',
    left: '20%',
    bottom: 80,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  buttonLabel: {
    fontFamily: "Roboto_500Medium",
    fontWeight: "500",
    fontSize: 16,
    color: "#FFFFFF",
  },
  handle: {
    position: "absolute",
    width: 108,
    height: 4,
    left: '50%',
    marginLeft: -54,
    bottom: 10,
    backgroundColor: "#1D1B20",
    borderRadius: 12,
  },
});
