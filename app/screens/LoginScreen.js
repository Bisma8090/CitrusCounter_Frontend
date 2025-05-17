import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alertShown, setAlertShown] = useState(false);
  const passwordInputRef = useRef(null);

  const validatePhoneNumber = (input) => /^03\d{9}$/.test(input);
  const validatePassword = (input) => /^[A-Za-z0-9]{6}$/.test(input);

  const showAlertOnce = (title, message) => {
    if (!alertShown) {
      setAlertShown(true);
      Alert.alert(title, message, [{ text: 'OK', onPress: () => setAlertShown(false) }]);
    }
  };

  const handlePhoneNumberChange = (input) => {
    let formattedInput = input.replace(/\D/g, '');

    if (formattedInput.length === 1 && formattedInput !== '0') {
      showAlertOnce('Invalid Number', 'Pakistani number must start with 03');
      return;
    }

    if (formattedInput.length >= 2 && !formattedInput.startsWith('03')) {
      showAlertOnce('Invalid Number', 'Pakistani number must start with 03');
      return;
    }

    if (formattedInput.length > 11) {
      showAlertOnce('Invalid Number', 'Pakistani number must be exactly 11 digits.');
      return;
    }

    setPhoneNumber(formattedInput);

    if (validatePhoneNumber(formattedInput) && formattedInput.length === 11) {
      passwordInputRef.current?.focus();
    }
  };

  const handlePasswordChange = (input) => {
    let formattedInput = input.replace(/[^A-Za-z0-9]/g, '');
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
      Alert.alert('Error', 'Password must be exactly 6 alphanumeric characters.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://citruscounter-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phonenumber: phoneNumber, password }),
      });

      const data = await response.json();

      console.log('Login response:', data);

      if (response.ok) {
        if (data.user) {
         await AsyncStorage.setItem(
  'userData',
  JSON.stringify({
    name: data.user.fullname || data.user.name,
    phone: data.user.phonenumber || data.user.phone,
  })
);


        }

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
          })
        );
      } else {
        Alert.alert('Error', data?.message || 'Invalid credentials, please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', `Network or Server Error: ${error.message}`);
    } finally {
      setLoading(false);
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

        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>LOGIN</Text>}
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
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textShadowColor: 'rgba(11, 11, 11, 0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 50,
    textShadowColor: 'rgba(11, 11, 11, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: 'rgb(255, 255, 255)',
    fontWeight: 'bold',
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
  passwordInput: { flex: 1, color: '#fff' },
  forgotPassword: { color: '#fff', alignSelf: 'flex-end', marginBottom: 20 },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2a7e19',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
  },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  signupText: { color: '#fff' },
  signupLink: { color: '#ffd700', fontWeight: 'bold' },
});

export default LoginScreen;
