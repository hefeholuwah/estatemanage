import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Share, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';

const QRCodeScreen = ({ route, navigation }) => {
  const visitor = route.params?.visitor;

  const handleCopyCode = async () => {
    try {
      if (!visitor?.accessCode) {
        Alert.alert('Error', 'No access code available');
        return;
      }
      await Clipboard.setStringAsync(visitor.accessCode);
      Alert.alert('Success', 'Access code copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy code');
    }
  };

  const handleShare = async () => {
    try {
      if (!visitor?.accessCode) {
        Alert.alert('Error', 'No access code available');
        return;
      }
      const result = await Share.share({
        message: `Your access code for Estate One is: ${visitor.accessCode}. This code will expire in 30 minutes.`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share code');
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <ExpoStatusBar style="dark" />
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>Ayomide,</Text>
            <Text style={styles.profileApartment}>Apt 001</Text>
          </View>
          <Image
            source={{
              uri: "https://api.builder.io/api/v1/image/assets/TEMP/b33515045c777d0c286b60717fe7b167b8c5d1c9?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36",
            }}
            style={styles.profileImage}
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.description}>
            Access code generated for guests will expire after 30 minutes
          </Text>
          
          <Text style={styles.title}>Visitor Access Code</Text>

          <View style={styles.qrContainer}>
            {visitor?.qrCode ? (
              <Image
                source={{ uri: visitor.qrCode }}
                style={styles.qrCode}
              />
            ) : (
              <View style={styles.qrCodePlaceholder}>
                <Text style={styles.qrCodePlaceholderText}>QR Code Not Available</Text>
              </View>
            )}
            <Text style={styles.pinCode}>
              {visitor?.accessCode || 'Generating...'}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="content-copy" size={24} color="white" />
                <Text style={styles.buttonLabel}>Copy Code</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="share" size={24} color="white" />
                <Text style={styles.buttonLabel}>Share</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate('Dashboard')}
          >
            <View style={styles.backButtonContent}>
              <MaterialIcons name="arrow-back" size={24} color="white" />
              <Text style={styles.buttonLabel}>Back to Dashboard</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#CAC4D0',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 8,
    borderColor: '#CAC4D0',
    borderRadius: 18,
  },
  profileCard: {
    position: 'absolute',
    width: '95%',
    height: 140,
    left: '2.5%',
    top: 76,
    backgroundColor: "#31111D",
    borderWidth: 0.5,
    borderColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileTextContainer: {
    marginLeft: 16,
  },
  profileName: {
    fontFamily: "Raleway_500Medium",
    fontSize: 32,
    lineHeight: 37,
    color: "#FFFFFF",
    fontWeight: '500',
  },
  profileApartment: {
    fontFamily: "Raleway_400Regular",
    fontSize: 20,
    lineHeight: 37,
    color: "#FFFFFF",
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 220, // Give space for the profile card
  },
  description: {
    marginTop: 12,
    fontFamily: 'Raleway_300Light',
    fontSize: 12,
    lineHeight: 15,
    color: '#000000',
  },
  title: {
    marginTop: 10,
    fontFamily: 'Raleway_400Regular',
    fontSize: 24,
    color: '#000000',
    fontWeight: '400',
  },
  qrContainer: {
    marginTop: 24,
    width: '100%',
    backgroundColor: '#F8F9FF',
    borderWidth: 0.5,
    borderColor: '#CAC4D0',
    borderRadius: 6.5,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCode: {
    width: 204,
    height: 192,
  },
  pinCode: {
    fontFamily: 'Raleway_600SemiBold',
    fontSize: 48,
    textAlign: 'center',
    color: '#000000',
    marginTop: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  copyButton: {
    flex: 1,
  },
  shareButton: {
    flex: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  backButton: {
    alignSelf: 'center',
    marginTop: 40,
    width: 218,
  },
  backButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  buttonLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  handle: {
    width: 108,
    height: 4,
    backgroundColor: '#1D1B20',
    borderRadius: 12,
  },
  qrCodePlaceholder: {
    width: 204,
    height: 192,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  qrCodePlaceholderText: {
    fontFamily: 'Raleway_400Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

export { QRCodeScreen }; 