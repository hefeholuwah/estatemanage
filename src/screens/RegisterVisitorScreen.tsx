import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { StatusBar } from "../components/StatusBar";
import { InputField } from "../components/InputField";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ResponsiveContainer } from "../components/ResponsiveContainer";
import { visitorService } from "../utils/api";

// Get screen dimensions for responsive sizing
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type RegisterVisitorScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RegisterVisitor'>;

interface RegisterVisitorScreenProps {
  navigation: RegisterVisitorScreenNavigationProp;
}

export const RegisterVisitorScreen: React.FC<RegisterVisitorScreenProps> = ({ navigation }) => {
  const [visitorName, setVisitorName] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleGenerateCode = async () => {
    if (!visitorName.trim()) {
      Alert.alert('Error', 'Please enter visitor name');
      return;
    }

    try {
      setLoading(true);
      
      const visitorData = {
        name: visitorName,
        visitDate: date,
        visitTime: formatTime(time)
      };
      
      const response = await visitorService.registerVisitor(visitorData);
      setLoading(false);
      
      // Navigate to QR code screen with visitor data
      navigation.navigate('QRCode', { visitor: response.data });
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to register visitor. Please try again.');
      console.error('Error registering visitor:', error);
    }
  };

  return (
    <ResponsiveContainer scrollable={true} keyboardAvoiding={true}>
      <View style={styles.contentContainer}>
        <StatusBar
          textColor="#1D1B20"
          signalIcon="https://api.builder.io/api/v1/image/assets/TEMP/2d2b4f8c65ce1fc5dd9c511eb41beeb36db4f29f?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36"
          homeIcon="https://api.builder.io/api/v1/image/assets/TEMP/93d47d4b04a8df4b9c12bad2406c32f2b493ed92?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36"
        />
        
        {/* Profile Card */}
        <View style={styles.profileCardContainer}>
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
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.formContainer}>
          {/* Description */}
          <Text style={styles.description}>
            Register any new visitors and generate an access code for them
          </Text>
          
          {/* Title */}
          <Text style={styles.title}>Register visitor</Text>

          {/* Form Fields */}
          <View style={styles.visitorNameField}>
            <InputField
              label="Visitor's Name"
              borderColor="#79747E"
              textColor="#49454F"
              value={visitorName}
              onChangeText={setVisitorName}
            />
          </View>

          {/* Date Picker */}
          <View style={styles.dateField}>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerLabel}>Date</Text>
              <Text style={styles.datePickerValue}>{formatDate(date)}</Text>
              <MaterialIcons name="calendar-today" size={24} color="#6750A4" style={styles.datePickerIcon} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="datePicker"
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          {/* Time Picker */}
          <View style={styles.timeField}>
            <TouchableOpacity 
              style={styles.timePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timePickerLabel}>Time</Text>
              <Text style={styles.timePickerValue}>{formatTime(time)}</Text>
              <MaterialIcons name="access-time" size={24} color="#6750A4" style={styles.timePickerIcon} />
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                testID="timePicker"
                value={time}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={onTimeChange}
              />
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {/* Generate Code Button */}
            <View style={styles.generateButtonContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#000000" />
              ) : (
                <TouchableOpacity 
                  style={styles.generateButton}
                  onPress={handleGenerateCode}
                >
                  <View style={styles.buttonContent}>
                    <MaterialIcons name="qr-code" size={24} color="white" />
                    <Text style={styles.buttonLabel}>Generate Code</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Back to Dashboard Button */}
            <View style={styles.backButtonContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.navigate('Dashboard')}
              >
                <View style={styles.buttonContent}>
                  <MaterialIcons name="arrow-back" size={24} color="white" />
                  <Text style={styles.buttonLabel}>Back to Dashboard</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
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
  contentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  profileCardContainer: {
    width: '95%',
    height: screenHeight * 0.15,
    marginTop: screenHeight * 0.08,
    marginHorizontal: '2.5%',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  profileCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#31111D',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileImage: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    borderRadius: screenWidth * 0.1,
  },
  profileTextContainer: {
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Raleway_500Medium',
    fontWeight: '500',
    fontSize: screenWidth * 0.07,
    color: '#FFFFFF',
  },
  profileApartment: {
    fontFamily: 'Raleway_400Regular',
    fontWeight: '400',
    fontSize: screenWidth * 0.045,
    color: '#FFFFFF',
    marginTop: 4,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: '5%',
    marginTop: screenHeight * 0.02,
  },
  description: {
    fontFamily: 'Raleway_300Light',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 15,
    color: '#000000',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Raleway_400Regular',
    fontWeight: '400',
    fontSize: 24,
    color: '#000000',
    marginBottom: 20,
  },
  visitorNameField: {
    width: '100%',
    marginBottom: 20,
  },
  dateField: {
    width: '100%',
    marginBottom: 20,
  },
  datePickerButton: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#6750A4',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingTop: 8,
    justifyContent: 'center',
  },
  datePickerLabel: {
    position: 'absolute',
    top: 8,
    left: 16,
    fontSize: 12,
    color: '#6750A4',
    fontFamily: 'Roboto_500Medium',
  },
  datePickerValue: {
    fontSize: 16,
    color: '#1D1B20',
    fontFamily: 'Roboto_500Medium',
    marginTop: 16,
  },
  datePickerIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
  },
  timeField: {
    width: '100%',
    marginBottom: 20,
  },
  timePickerButton: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#79747E',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingTop: 8,
    justifyContent: 'center',
  },
  timePickerLabel: {
    position: 'absolute',
    top: 8,
    left: 16,
    fontSize: 12,
    color: '#49454F',
    fontFamily: 'Roboto_500Medium',
  },
  timePickerValue: {
    fontSize: 16,
    color: '#49454F',
    fontFamily: 'Roboto_500Medium',
    marginTop: 16,
  },
  timePickerIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
  },
  buttonsContainer: {
    flexDirection: 'column',
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  generateButtonContainer: {
    width: '100%',
    marginBottom: 20,
    minHeight: 56,
    justifyContent: 'center',
  },
  generateButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#000000',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonContainer: {
    width: '100%',
  },
  backButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#000000',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  buttonLabel: {
    fontFamily: 'Roboto_500Medium',
    fontWeight: '500',
    fontSize: 16,
    color: '#FFFFFF',
  },
  handleContainer: {
    height: 24,
    width: '100%',
    justifyContent: 'center',
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
