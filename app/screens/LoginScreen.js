import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const passwordInputRef = useRef(null);

  const validatePhoneNumber = (input) => {
    return /^03\d{9}$/.test(input);
  };

  const handlePhoneNumberChange = (input) => {
    let formattedInput = input.replace(/\D/g, '');

    if (formattedInput.length === 1 && formattedInput !== '0') {
      setTimeout(() => Alert.alert('Invalid Number', 'Pakistani number must start with 03'), 100);
      return;
    }

    if (formattedInput.length >= 2 && !formattedInput.startsWith('03')) {
      setTimeout(() => Alert.alert('Invalid Number', 'Pakistani number must start with 03'), 100);
      return;
    }

    if (formattedInput.length > 11) {
      setTimeout(() => Alert.alert('Invalid Number', 'Pakistani number must be exactly 11 digits.'), 100);
      return;
    }

    setPhoneNumber(formattedInput);
    if (validatePhoneNumber(formattedInput)) {
      passwordInputRef.current?.focus();
    }
  };

  const validatePassword = (input) => /^[A-Za-z0-9]{6}$/.test(input);

  const handlePasswordChange = (input) => {
    let formattedInput = input.replace(/[^A-Za-z0-9]/g, '');

    if (input.length > 6) {
      setTimeout(() => Alert.alert('Invalid Password', 'Password must be exactly 6 characters (letters & numbers only).'), 100);
    }

    if (input !== formattedInput) {
      setTimeout(() => Alert.alert('Invalid Character', 'Only letters & numbers are allowed in password.'), 100);
    }

    setPassword(formattedInput.slice(0, 6));
  };

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Error', 'Phone number and password are required!');
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Invalid Pakistani phone number!');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be exactly 6 characters.');
      return;
    }

    try {
      const response = await fetch('https://de6e-202-166-163-82.ngrok-free.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phonenumber: phoneNumber, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: () => navigation.navigate('HomeScreen') },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Invalid credentials, please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please check your connection.');
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
          placeholder="03XXXXXXXXX"
          placeholderTextColor="rgb(216, 213, 213)"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          maxLength={11}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            ref={passwordInputRef}
            style={styles.passwordInput}
            placeholder="••••••"
            placeholderTextColor="rgb(216, 213, 213)"
            secureTextEntry={secureTextEntry}
            value={password}
            onChangeText={handlePasswordChange}
          />
          <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
            <Icon name={secureTextEntry ? 'eye-slash' : 'eye'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
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
  container: { flex: 1 },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  title: { fontSize: 38, fontWeight: 'bold', color: '#fff',textTransform: 'uppercase', 
    letterSpacing: 1, 
    textShadowColor: 'rgba(11, 11, 11, 0.3)', 
    textShadowOffset: { width: 1, height: 2 }, 
    textShadowRadius: 5 },
  subtitle: { fontSize: 18, color: '#fff', marginBottom: 50 },
  label: { alignSelf: 'flex-start', fontSize: 16, color: 'rgb(255, 255, 255)', fontWeight: 'bold', marginBottom: 10 },
  input: { width: '100%', height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#fff', paddingHorizontal: 15, color: '#fff', marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.2)' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#fff', paddingHorizontal: 15, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 15 },
  passwordInput: { flex: 1, color: '#fff' },
  forgotPassword: { color: '#fff', alignSelf: 'flex-end', marginBottom: 20 },
  loginButton: { width: '100%', height: 50, backgroundColor: '#2a7e19', justifyContent: 'center', alignItems: 'center', borderRadius: 25, marginBottom: 20 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  signupText: { color: '#fff' },
  signupLink: { color: '#ffd700', fontWeight: 'bold' },
});

export default LoginScreen;
