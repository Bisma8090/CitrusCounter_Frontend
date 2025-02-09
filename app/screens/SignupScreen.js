import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmEntry, setSecureConfirmEntry] = useState(true);

  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const validatePhoneNumber = (input) => {
    return /^03\d{9}$/.test(input);
  };

  const handlePhoneNumberChange = (input) => {
    let formattedInput = input.replace(/\D/g, "");

    if (formattedInput.length === 1 && formattedInput !== "0") {
      setTimeout(() => Alert.alert('Invalid Number', 'Pakistani number must start with 03'), 100);
      return;
    }

    if (formattedInput.length >= 2 && !formattedInput.startsWith("03")) {
      setTimeout(() => Alert.alert('Invalid Number', 'Pakistani number must start with 03'), 100);
      return;
    }

    if (formattedInput.length > 11) {
      setTimeout(() => Alert.alert('Invalid Number', 'Pakistani number must be exactly 11 digits.'), 100);
      return;
    }

    setPhoneNumber(formattedInput);
  };

  const validatePassword = (input) => /^[A-Za-z0-9]{6}$/.test(input);

  const handlePasswordChange = (input, type) => {
    let formattedInput = input.replace(/[^A-Za-z0-9]/g, "");

    if (input.length > 6) {
      setTimeout(() => Alert.alert('Invalid Password', 'Password must be exactly 6 characters (letters & numbers only).'), 100);
    }

    if (input !== formattedInput) {
      setTimeout(() => Alert.alert('Invalid Character', 'Only letters & numbers are allowed in password.'), 100);
    }

    if (type === "password") {
      setPassword(formattedInput.slice(0, 6));
    } else {
      setConfirmPassword(formattedInput.slice(0, 6));
    }
  };

  const handleSignup = async () => {
    if (!name || !phoneNumber || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Invalid Pakistani phone number!');
      return;
    }
    if (password.length !== 6) {
      Alert.alert('Error', 'Password must be exactly 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
  
    try {
      const response = await fetch('https://your-backend-url.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phoneNumber,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', 'Your signup request has been sent!', [
          { text: 'OK', onPress: () => navigation.navigate('HomeScreen') }
        ]);
      } else {
        Alert.alert('Error', data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please check your connection.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/bgphoto.png')} style={styles.backgroundImage} />
      <View style={styles.overlay}>
        <Text style={styles.title}>Sign Up</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor="rgb(216, 213, 213)"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current.focus()}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          ref={phoneRef}
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
            ref={passwordRef}
            style={styles.passwordInput}
            placeholder="••••••"
            placeholderTextColor="rgb(216, 213, 213)"
            secureTextEntry={secureTextEntry}
            value={password}
            onChangeText={(text) => handlePasswordChange(text, "password")}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current.focus()}
          />
          <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
            <Icon name={secureTextEntry ? 'eye-slash' : 'eye'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            ref={confirmPasswordRef}
            style={styles.passwordInput}
            placeholder="••••••"
            placeholderTextColor="rgb(216, 213, 213)"
            secureTextEntry={secureConfirmEntry}
            value={confirmPassword}
            onChangeText={(text) => handlePasswordChange(text, "confirmPassword")}
          />
          <TouchableOpacity onPress={() => setSecureConfirmEntry(!secureConfirmEntry)}>
            <Icon name={secureConfirmEntry ? 'eye-slash' : 'eye'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>SIGN UP</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            Login
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
  title: { fontSize: 38, fontWeight: 'bold', color: '#fff' },
  label: { alignSelf: 'flex-start', fontSize: 16, color: 'rgb(255, 255, 255)', fontWeight: 'bold', marginBottom: 10 },
  input: { width: '100%', height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#fff', paddingHorizontal: 15, color: '#fff', marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.2)' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#fff', paddingHorizontal: 15, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 15 },
  passwordInput: { flex: 1, color: '#fff' },
  signupButton: { width: '100%', height: 50, backgroundColor: '#2a7e19', justifyContent: 'center', alignItems: 'center', borderRadius: 25, marginBottom: 20 },
  signupButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loginText: { color: '#fff' },
  loginLink: { color: '#ffd700', fontWeight: 'bold' },
});

export default SignupScreen;
