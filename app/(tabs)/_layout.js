import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ⬅️ import AsyncStorage

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import CitrusCounterScreen from '../screens/CitrusCounterScreen';
import SummaryScreen from '../screens/SummaryScreen';
import ReportScreen from '../screens/ReportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        setIsLoggedIn(!!userData); // true if data exists
      } catch (error) {
        console.log('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator initialRouteName={isLoggedIn ? 'HomeScreen' : 'Login'} screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="SignUp" component={SignupScreen} />
  <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  <Stack.Screen name="HomeScreen" component={HomeScreen} />
  <Stack.Screen name="CitrusCounter" component={CitrusCounterScreen} />
  <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
  <Stack.Screen name="ReportScreen" component={ReportScreen} />
  <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
  <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
</Stack.Navigator>

  );
}
