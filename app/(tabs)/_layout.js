import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

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
import MapScreen from '../screens/MapScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Future authentication support

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="CitrusCounter" component={CitrusCounterScreen} />
          <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
          <Stack.Screen name="ReportScreen" component={ReportScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <Stack.Screen name="MapScreen" component={MapScreen} />

        </>
      ) : (
        <>
          <Stack.Screen name="CitrusCounter" component={CitrusCounterScreen} />
          <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
