import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [landSize, setLandSize] = useState('');
  const [totalTrees, setTotalTrees] = useState('');
  const [location, setLocation] = useState('Fetching location...');

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
    setLocation(`${loc.coords.latitude}, ${loc.coords.longitude}`);
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
          <TextInput style={styles.input} placeholder="Enter Size" keyboardType="numeric" value={landSize} onChangeText={setLandSize} />
          <Text style={styles.placeholder}>E.g., 5 acres</Text>
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Number of Trees</Text>
          <TextInput style={styles.input} placeholder="Enter Count" keyboardType="numeric" value={totalTrees} onChangeText={setTotalTrees} />
          <Text style={styles.placeholder}>E.g., 50 trees</Text>
        </View>
      </View>

      {/* Location */}
      <TouchableOpacity style={styles.locationBox} onPress={() => navigation.navigate('MapScreen')}>
        <Text style={styles.label}>Your Farm Location</Text>
        <Text style={styles.locationText}>{location}</Text>
      </TouchableOpacity>

      {/* Add Images */}
      <TouchableOpacity style={styles.imageUploadBox} onPress={() => navigation.navigate('ImageUploadScreen')}>
        <Text style={styles.label}>Add images for count</Text>
        <FontAwesome5 name="camera" size={40} color="#2a7e19" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome5 name="home" size={24} color="#2a7e19" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome5 name="user" size={24} color="#2a7e19" />
          <Text style={styles.navText}>My Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2a7e19', textAlign: 'center', marginTop: 50 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20, color: '#666' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  inputBox: { flex: 1, borderWidth: 1, borderColor: '#2a7e19', borderRadius: 10, padding: 10, marginHorizontal: 5 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  input: { fontSize: 16, marginTop: 5 },
  placeholder: { fontSize: 12, color: '#999' },
  locationBox: { borderWidth: 1, borderColor: '#2a7e19', borderRadius: 10, padding: 15, marginVertical: 10 },
  locationText: { fontSize: 16, color: '#666', marginTop: 5 },
  imageUploadBox: { borderWidth: 1, borderColor: '#2a7e19', borderRadius: 10, padding: 20, alignItems: 'center', marginTop: 20 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, borderTopWidth: 1, borderColor: '#ccc', position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff' },
  navButton: { alignItems: 'center' },
  navText: { fontSize: 12, color: '#2a7e19', marginTop: 2 },
  topDesign: { position: 'absolute', width: 100, height: 100, backgroundColor: 'green', borderRadius: 50, top: -20, left: -20 },
  orangeCircle: { backgroundColor: 'orange', right: -30, left: 'auto' }
});

export default HomeScreen;
