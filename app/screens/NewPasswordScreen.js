import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const ResetPasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validatePassword = (password) => /^[a-zA-Z0-9]{6}$/.test(password);

  const handleResetPassword = () => {
    if (!validatePassword(newPassword) || !validatePassword(confirmPassword)) {
      Alert.alert('Invalid Input', 'Password must be exactly 6 letters or digits only!');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    Alert.alert('Success', 'Your password has been reset successfully!');
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      {/* Background Design */}
      <View style={styles.topLeftDecoration} />
      <View style={styles.bottomRightDecoration} />
      <View style={styles.topRightDecoration} />
      <View style={styles.bottomLeftDecoration} />

      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter a new password for your account</Text>

        <Text style={styles.inputLabel}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="......"
          placeholderTextColor="gray"
          secureTextEntry={true}
          maxLength={6}
          value={newPassword}
          onChangeText={(text) => {
            if (/^[a-zA-Z0-9]{0,6}$/.test(text)) {
              setNewPassword(text);
            } else {
              Alert.alert('Invalid Input', 'Password must be 6 letters or digits only!');
            }
          }}
        />

        <Text style={styles.inputLabel}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="......"
          placeholderTextColor="gray"
          secureTextEntry={true}
          maxLength={6}
          value={confirmPassword}
          onChangeText={(text) => {
            if (/^[a-zA-Z0-9]{0,6}$/.test(text)) {
              setConfirmPassword(text);
            } else {
              Alert.alert('Invalid Input', 'Password must be 6 letters or digits only!');
            }
          }}
        />

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
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

  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
     color: 'gray',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },

  input: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'RGB(211, 211, 211)',
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#2a7e19',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default ResetPasswordScreen;
