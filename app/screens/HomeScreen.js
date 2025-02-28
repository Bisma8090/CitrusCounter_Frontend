import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [landSize, setLandSize] = useState('');
  const [totalTrees, setTotalTrees] = useState('');
  const [location, setLocation] = useState('Fetching location...');
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please allow location access in settings.');
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    if (reverseGeocode.length > 0) {
      let address = `${reverseGeocode[0].name}, ${reverseGeocode[0].city}, ${reverseGeocode[0].region}`;
      setLocation(address);
    } else {
      setLocation("Location not found");
    }
  };
  const saveLandData = async () => {
    try {
      console.log('Saving data:', { landSize, totalTrees, location });

    //   const response = await fetch('https://your-backend-api.com/save-land-data', {  // ✅ Actual API URL lagao
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       landSize,
    //       totalTrees,
    //       location,
    //     }),
    //   });
  
    //   const text = await response.text();  // ✅ Backend ka response pehle text format me lo
    //   console.log('Raw Response:', text); 
  
    //   const result = JSON.parse(text);  // ✅ Phir JSON parse karo
    //   console.log('Data saved:', result);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  

  // ✅ Auto-save jab user input kare (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (landSize && totalTrees) {
        saveLandData();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [landSize, totalTrees]);

  // ✅ Auto-save jab location mil jaye
  useEffect(() => {
    if (location !== "Fetching location..."  && location !== "Location not found") {
      saveLandData();
    }
  }, [location]);

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
          <TextInput style={styles.input} placeholder="Enter Size" keyboardType="numeric" value={landSize} onChangeText={(text) => setLandSize(text.replace(/[^0-9]/g, ''))}  />
          <Text style={styles.placeholder}>E.g., 5 acres</Text>
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Number of Trees</Text>
          <TextInput style={styles.input} placeholder="Enter Count" keyboardType="numeric" value={totalTrees} onChangeText={(text) => setTotalTrees(text.replace(/[^0-9]/g, ''))}/>
          <Text style={styles.placeholder}>E.g., 50 trees</Text>
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
      <TouchableOpacity style={styles.imageUploadBox} onPress={() => navigation.navigate('CitrusCounter')}>
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
  title: { fontSize: 30, fontWeight: 'bold', color: '#2a7e19', marginTop: 70, 
    letterSpacing: 1, 
    textShadowColor: 'rgba(11, 11, 11, 0.3)', 
    textShadowOffset: { width: 1, height: 2 }, 
    textShadowRadius: 5 
  },
  subtitle: { fontWeight: 'bold', fontSize: 16, marginTop: 10, marginBottom: 20, color: '#2a7e19', marginLeft: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  inputBox: { flex: 1, borderWidth: 0.7, borderColor: '#2a7e19', borderRadius: 10, padding: 10, marginHorizontal: 5 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  input: { fontSize: 16, marginTop: 5, borderRadius: 9, borderColor: 'grey', borderWidth: 0.3 },
  placeholder: { fontSize: 12, color: '#999', marginLeft: 6 },

  // Location Box with Smaller Map
  locationBox: { 
    borderWidth: 0.7, borderColor: '#2a7e19', borderRadius: 10, padding: 10, 
    marginVertical: 10, position: 'relative', backgroundColor: '#f9f9f9' 
  },
  label1: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  locationText: { fontSize: 14, color: '#666', marginBottom: 5 },
  map: { 
    width: '100%', 
    height: 120,  // Smaller Map
    borderRadius: 10 
  },

  imageUploadBox: { borderWidth: 1, borderColor: '#2a7e19', borderRadius: 10, padding: 20, alignItems: 'center', marginTop: 20 },
  bottomNav: {  flexDirection: 'row', justifyContent: 'space-around', padding: 15, borderTopWidth: 0.7, alignSelf:'center', borderColor: 'grey', position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff' },
  navButton: { alignItems: 'center' },
  navText: { fontSize: 12, color: '#2a7e19', marginTop: 2 },

  // Top Design
  topDesign: { position: 'absolute', width: 100, height: 100, backgroundColor: 'green', borderRadius: 50, top: -20, left: -20 },
  orangeCircle: { backgroundColor: 'orange', right: -30, left: 'auto' }
});

export default HomeScreen;
