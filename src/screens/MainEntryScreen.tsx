import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from "react-native";

const MainEntryScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={{
          uri: "https://api.builder.io/api/v1/image/assets/TEMP/bdfd801283f0b5e53a21a6843a8d386c73da0af6?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36",
        }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={styles.title}>EstateOne</Text>
          
          <Text style={styles.subtitle}>Choose your login type:</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Resident Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.securityButton]}
              onPress={() => navigation.navigate('AdminLogin')}
            >
              <Text style={styles.buttonText}>Security Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 60,
    textDecorationLine: 'underline',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 20,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  securityButton: {
    backgroundColor: '#004080',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export { MainEntryScreen }; 