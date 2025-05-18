import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [landSize, setLandSize] = useState('');
  const [totalTrees, setTotalTrees] = useState('');
  const [location, setLocation] = useState('Fetching location...');
  const [coords, setCoords] = useState(null);

  useEffect(() => {
  const timer = setTimeout(() => {
    getLocation();
  }, 500); // half second delay

  return () => clearTimeout(timer);
}, []);

const getLocation = async () => {
  try {
    const locationServicesEnabled = await Location.hasServicesEnabledAsync();
    if (!locationServicesEnabled) {
      Alert.alert("Location Services Disabled", "Please enable location services on your device.");
      return;
    }

    // Check permission status first
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      let permissionResponse = await Location.requestForegroundPermissionsAsync();
      status = permissionResponse.status;
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow location access in settings.');
        return;
      }
    }

    // Now fetch location safely
    let loc = await Location.getCurrentPositionAsync({});
    setCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    if (reverseGeocode.length > 0 && reverseGeocode[0]) {
      let address = `${reverseGeocode[0].name ?? ''}, ${reverseGeocode[0].city ?? ''}, ${reverseGeocode[0].region ?? ''}`;
      setLocation(address);
    } else {
      setLocation("Location not found");
    }

  } catch (error) {
    console.log("Location error:", error);
    Alert.alert("Error", "Failed to fetch location. Please make sure your GPS is turned on.");
    setLocation("Location unavailable");
  }
};


  const generateReport = () => {
    console.log('HomeScreen generateReport called');
    console.log('Current totalTrees:', totalTrees, typeof totalTrees);
    console.log('Current landSize:', landSize);

    if (location === 'Fetching location...') {
      Alert.alert('Please wait', 'We are still fetching your location.');
      return;
    }

    if (!landSize || !totalTrees) {
      Alert.alert('Missing Information', 'Please enter both land size and number of trees.');
      return;
    }

    navigation.navigate('ReportScreen', {
  landSize,
  totalTrees: parseInt(totalTrees), // ✅ this ensures numeric value is sent
  location,
  date: new Date().toLocaleDateString(),
  farmerName: 'Sample Farmer',
  citrusCountPerTree: '10',
});

  };

  return (
    <View style={styles.container}>
      {/* Top Design Elements */}
      <View style={styles.topDesign} />
      <View style={[styles.topDesign, styles.orangeCircle]} />

      {/* Heading */}
      <Text style={styles.title}>CitrusCounter</Text>
      <Text style={styles.subtitle}>Make citrus farming easier with quick and accurate counts</Text>

      {/* Inputs */}
      <View style={styles.row}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>Land Size (acres)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Size"
            keyboardType="numeric"
            value={landSize}
            onChangeText={(text) => setLandSize(text.replace(/[^0-9]/g, ''))}
          />
<TouchableOpacity
  style={styles.saveButton}
  onPress={async () => {
    if (!landSize) {
      Alert.alert('Missing Input', 'Please enter number of acres before saving.');
      return;
    }
    try {
      await AsyncStorage.setItem('savedlandsize', landSize);
      Alert.alert('Success', 'Number of acres saved successfully.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save the number of acres.');
    }
  }}
>
  <Text style={styles.saveButtonText}>Enter</Text>
</TouchableOpacity>
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Number of Trees</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Count"
            keyboardType="numeric"
            value={totalTrees}
            onChangeText={(text) => {
              console.log('User input totalTrees:', text);
              setTotalTrees(text.replace(/[^0-9]/g, ''));
            }}
          />
<TouchableOpacity
  style={styles.saveButton}
  onPress={async () => {
    if (!totalTrees) {
      Alert.alert('Missing Input', 'Please enter number of trees before saving.');
      return;
    }
    try {
      await AsyncStorage.setItem('savedTotalTrees', totalTrees);
      Alert.alert('Success', 'Number of trees saved successfully.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save the number of trees.');
    }
  }}
>
  <Text style={styles.saveButtonText}>Enter</Text>
</TouchableOpacity>
        </View>
      </View>

      {/* Location Box with Map */}
      <View style={styles.locationBox}>
        <Text style={styles.label1}>Your Farm Location</Text>
        <Text style={styles.locationText}>{location}</Text>
     

        {coords && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: coords.latitude,
              longitude: coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={{ latitude: coords.latitude, longitude: coords.longitude }} />
          </MapView>
        )}
      </View>

      {/* Add Images */}
      <TouchableOpacity
        style={styles.imageUploadBox}
        onPress={() => navigation.navigate('CitrusCounter')}
      >
        <Text style={styles.label}>Add images for count</Text>
        <FontAwesome5 name="camera" size={40} color="#2a7e19" />
      </TouchableOpacity>

      

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome5 name="home" size={24} color="#2a7e19" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <FontAwesome5 name="user" size={24} color="#2a7e19" />
          <Text style={styles.navText}>My Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2a7e19',
    marginTop: 70,
    letterSpacing: 1,
    textShadowColor: 'rgba(11, 11, 11, 0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    color: '#2a7e19',
    marginLeft: 6,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  inputBox: {
    flex: 1,
    borderWidth: 0.7,
    borderColor: '#2a7e19',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  input: { fontSize: 16, marginTop: 5, borderRadius: 9, borderColor: 'grey', borderWidth: 0.3 },
  placeholder: { fontSize: 12, color: '#999', marginLeft: 6 },

  locationBox: {
    borderWidth: 0.7,
    borderColor: '#2a7e19',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    position: 'relative',
    backgroundColor: '#f9f9f9',
  },
  label1: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  locationText: { fontSize: 14, color: '#666', marginBottom: 5 },
  map: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },

  imageUploadBox: {
    borderWidth: 1,
    borderColor: '#2a7e19',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
saveButton: {
  marginTop: 8,
  backgroundColor: '#2a7e19',
  paddingVertical: 6,
  borderRadius: 6,
  alignItems: 'center',
},
saveButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
},

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 0.7,
    alignSelf: 'center',
    borderColor: 'grey',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  navButton: { alignItems: 'center' },
  navText: { fontSize: 12, color: '#2a7e19', marginTop: 2 },

  button: {
    backgroundColor: '#2a7e19',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  topDesign: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: 'green',
    borderRadius: 50,
    top: -20,
    left: -20,
  },
  orangeCircle: { backgroundColor: 'orange', right: -30, left: 'auto' },
});

export default HomeScreen;
