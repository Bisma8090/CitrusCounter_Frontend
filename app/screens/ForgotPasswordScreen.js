import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const validatePhoneNumber = (input) => /^03\d{9}$/.test(input);

  const handlePhoneNumberChange = (input) => {
    let formattedInput = input.replace(/\D/g, "");
    if (formattedInput.length > 11) {
      Alert.alert('Invalid Number', 'Pakistani number must be exactly 11 digits.');
      return;
    }
    setPhoneNumber(formattedInput);
  };

  const handleRequestOTP = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Enter a valid Pakistani phone number!');
      return;
    }
    try {
      const response = await fetch('https://your-backend-url.com/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'OTP sent to your phone.');
        navigation.navigate('VerifyOTPScreen', { phoneNumber });
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network issue, please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/bgphoto.png')} style={styles.backgroundImage} />
      <View style={styles.overlay}>
        <Text style={styles.title}>Forget Password</Text>
        <Text style={styles.label}>Please enter your Mobile Number to request a recovery code</Text>
        <TextInput
          style={styles.input}
          placeholder="03XXXXXXXXX"
          placeholderTextColor="rgb(216, 213, 213)"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          maxLength={11}
        />
        <TouchableOpacity style={styles.button} onPress={handleRequestOTP}>
          <Text style={styles.buttonText}>Request OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'flex-start', 
    paddingHorizontal: 25,  
    paddingTop: 20,  
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: { 
    textTransform: 'uppercase', 
    textShadowColor: 'rgba(11, 11, 11, 0.3)', 
    textShadowOffset: { width: 1, height: 2 }, 
    textShadowRadius: 5, 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 12,  
  },
  label: { 
    alignSelf: 'flex-start', 
    fontSize: 16, 
    color: 'rgba(255, 255, 255, 0.84)', 
    marginBottom: 36,  
  },
  input: { 
    width: '100%', 
    height: 50, 
    borderRadius: 11, 
    borderWidth: 1, 
    borderColor: '#fff', 
    paddingHorizontal: 15, 
    color: '#fff', 
    marginBottom: 63, 
    backgroundColor: 'rgba(255,255,255,0.2)' 
  },
  button: { 
    width: '66%', 
    height: 50, 
    backgroundColor: '#2a7e19', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 25, 
    marginBottom: 20, 
    alignSelf: 'center'
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default ForgotPasswordScreen;
