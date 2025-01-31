import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handlePhoneNumberChange = (input) => {
    // Check if the input starts with +923 (for 13 digits) or 03 (for 11 digits)
    if (input.startsWith('+923') && input.length > 13) {
      Alert.alert("Invalid Number", "Please enter a valid phone number.");
      return; // Prevent extra digits if starting with +923
    }
    
    if (input.startsWith('03') && input.length > 11) {
      Alert.alert("Invalid Number", "Please enter a valid phone number.");
      return; // Prevent extra digits if starting with 03
    }

    setPhoneNumber(input); // Update phone number state
    validatePhoneNumber(input); // Validate as the user types
  };

  const validatePhoneNumber = (phoneNumber) => {
    // Regex to validate both formats: +923xxxxxxxxx or 03xxxxxxxxx
    const regex = /^(03\d{9}|\+923\d{9})$/;

    if (regex.test(phoneNumber)) {
      console.log("✅ Valid Phone Number");
      return true;
    } else {
      console.log("❌ Invalid Number! Enter a valid Pakistani number (03XXXXXXXXX or +923XXXXXXXXX).");
      return false;
    }
  };

  const handlePasswordChange = (input) => {
    // Allow only alphanumeric characters and check length constraint
    if (/^[a-zA-Z0-9]*$/.test(input) && input.length <= 6) {
      setPassword(input); // Update password if valid
    } else {
      Alert.alert("Invalid Input", "Password should only contain letters and numbers and be 6 characters long.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/bgphoto.png')} style={styles.backgroundImage} />
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="XXXXXXXXXXX"
          placeholderTextColor="rgb(216, 213, 213)"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange} // Validate as user types
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••"
            placeholderTextColor="rgb(216, 213, 213)"
            secureTextEntry={secureTextEntry}
            value={password}
            onChangeText={handlePasswordChange} // Updated to validate password
          />
          <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
            <Icon name={secureTextEntry ? 'eye-slash' : 'eye'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don’t have an account?{' '}
          <Text style={styles.signupLink} onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Roboto',
    marginBottom: 2,
    textShadowColor: 'rgba(11, 11, 11, 0.3)', 
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 8, 
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Roboto',
    marginBottom: 50,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: 'rgb(255, 255, 255)',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 15,
    color: '#fff',
    fontFamily: 'Roboto',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
    fontFamily: 'Roboto',
  },
  forgotPassword: {
    color: '#fff',
    alignSelf: 'flex-end',
    fontFamily: 'Roboto',
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2a7e19', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  signupText: {
    color: '#fff',
    fontFamily: 'Roboto',
  },
  signupLink: {
    color: '#ffd700', // Yellow color
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});

export default LoginScreen;
