import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [landSize, setLandSize] = useState('');
  const [totalTrees, setTotalTrees] = useState('');

  useEffect(() => {}, []);

  const generateReport = () => {
    if (!landSize || !totalTrees) {
      Alert.alert('Missing Information', 'Please enter both land size and number of trees.');
      return;
    }

    navigation.navigate('ReportScreen', {
      landSize,
      totalTrees: parseInt(totalTrees),
      date: new Date().toLocaleDateString(),
      farmerName: 'Sample Farmer',
      citrusCountPerTree: '10',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topDesign} />
      <View style={[styles.topDesign, styles.orangeCircle]} />

      <Text style={styles.title}>CitrusCounter</Text>
      <Text style={styles.subtitle}>Make citrus farming easier with quick and accurate counts</Text>

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

      {/* Centered Image Upload Box */}
      <TouchableOpacity
        style={styles.imageUploadBox}
        onPress={() => navigation.navigate('CitrusCounter')}
      >
        <Text style={styles.imageUploadText}>Add images for count</Text>
        <FontAwesome5 name="camera" size={40} color="#2a7e19" />
      </TouchableOpacity>

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
  saveButton: {
    marginTop: 8,
    backgroundColor: '#2a7e19',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  imageUploadBox: {
    borderWidth: 1,
    borderColor: '#2a7e19',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center', // Centering horizontally and vertically
    marginTop: 30,
    minHeight: 250,
    flexDirection: 'column', // Ensures text and icon are stacked vertically
  },
  imageUploadText: {
    fontSize: 18,
    color: '#2a7e19',
    fontWeight: 'bold',
    marginBottom: 15,
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
});

export default HomeScreen;
