import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const VerifyOTPScreen = ({ route, navigation }) => {
  const phoneNumber = route?.params?.phoneNumber || '';
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Please enter the Recovery code sent to your Mobile Number</Text>
      
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOtpChange(index, value)}
          />
        ))}
      </View>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
      
      <Text style={styles.resendText}>I don’t receive a code? <Text style={styles.resendLink}>Please resend</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
        padding: 20, 
    backgroundColor: '#ffffff' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#2a7e19', 
    alignSelf: 'flex-start'

  },
  subtitle: { 
    fontSize: 14, 
    color: 'gray', 
    marginLeft: '5',
    marginBottom: 20, 
    textAlign: 'justify', 
    alignSelf: 'flex-start',
    width:'75%'
  },
  otpContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 20, 
    padding: 15,
    borderRadius: 10
  },
  otpInput: {
    width: 63, 
    height: 70, 
    borderWidth: 1, 
    borderRadius: 10,
    textAlign: 'center', 
    fontSize: 18, 
    marginHorizontal: 8, 
    borderColor: '#2a7e19', 
    backgroundColor: '#ffffff'
  },
  button: {
    backgroundColor: '#2a7e19', 
    paddingVertical: 12, 
    paddingHorizontal: 50,
    borderRadius: 25, 
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  resendText: { 
    fontSize: 14, 
    color: 'gray' 
  },
  resendLink: { 
    color: '#2a7e19', 
    fontWeight: 'bold' 
  }
});

export default VerifyOTPScreen;
