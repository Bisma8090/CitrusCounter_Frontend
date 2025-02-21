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
      {/* Background Decorative Elements */}
      <View style={styles.topLeftDecoration} />
      <View style={styles.bottomRightDecoration} />
      <View style={styles.topRightDecoration} />
      <View style={styles.bottomLeftDecoration} />

      <View style={styles.content}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Please enter the Recovery code sent to your Mobile Number
        </Text>

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

        <Text style={styles.resendText}>
          I don’t receive a code?{' '}
          <Text style={styles.resendLink}>Please resend</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },

  // Decorative Elements
  topLeftDecoration: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 130,
    height: 130,
    backgroundColor: '#ff9800', // Orange
    borderBottomRightRadius: 100,
    transform: [{ rotate: '45deg' }],
  },
  bottomRightDecoration: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 130,
    height: 130,
    backgroundColor: '#ff9800', // Orange
    borderTopLeftRadius: 100,
    transform: [{ rotate: '45deg' }],
  },
  topRightDecoration: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 90,
    height: 90,
    backgroundColor: '#2a7e19', // Green
    borderBottomLeftRadius: 60,
    transform: [{ rotate: '45deg' }],
  },
  bottomLeftDecoration: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 90,
    height: 90,
    backgroundColor: '#2a7e19', // Green
    borderTopRightRadius: 60,
    transform: [{ rotate: '45deg' }],
  },

  content: {
    width: '90%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2a7e19',
    marginBottom: 10,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(11, 11, 11, 0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: { fontSize: 14, color: 'gray', textAlign: 'center', marginBottom: 20 },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Centers the inputs properly
    alignItems: 'center',
    width: '100%', 
    marginBottom: 30, 
  },
  
  otpInput: {
    width: 60, // Reduced size
    height: 70, 
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    borderColor: '#2a7e19',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 10, // Equal spacing on both sides
  },
  button: {
    backgroundColor: '#2a7e19',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  resendText: { fontSize: 14, color: 'gray' },
  resendLink: { color: '#2a7e19', fontWeight: 'bold' },
});

export default VerifyOTPScreen;
