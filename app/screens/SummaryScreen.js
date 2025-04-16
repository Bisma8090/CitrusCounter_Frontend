import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SummaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [citrusCount, setCitrusCount] = useState(null);
  const [history, setHistory] = useState([]);
  const [farmerName, setFarmerName] = useState('');
  const [location, setLocation] = useState(route.params?.location || '');
  const [treesPerAcre, setTreesPerAcre] = useState(route.params?.totalTrees || null);

  useEffect(() => {
    fetchSummaryData();
    fetchUserData();
  }, []);
  

  const fetchSummaryData = async () => {
    try {
      const response = await fetch('http://192.168.37.218:5000/summary');
      const data = await response.json();
  
      if (data) {
        setCitrusCount(data.latest_count);
        setHistory(data.previous_history);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch summary data');
      console.error('Error fetching summary:', error);
    }
  };
  const fetchUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('farmerName');
      if (name) setFarmerName(name);
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data');
      console.error('Error loading user data:', error);
    }
  };
  const handleGenerateReport = async () => {
    const citrusPerTree = citrusCount ? citrusCount : "N/A"; // Only pass citrusCount if available
  
    const reportData = {
      date: new Date().toLocaleDateString(),
      farmerName: farmerName || "N/A",   // Farmer name from AsyncStorage or default to 'N/A'
      location: location || "N/A",       // Location from the route params or default to 'N/A'
      citrusCount: citrusCount ?? "N/A", // Citrus count from the summary page or 'N/A'
    };
  
    console.log("Sending report data: ", reportData);
  
    try {
      const response = await fetch('http://192.168.37.218:5000/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });
  
      const text = await response.text(); // Get the raw response as text
      try {
        const data = JSON.parse(text); // Try parsing the response as JSON
        console.log("✅ Report response:", data);
  
        if (!response.ok) {
          throw new Error(data.message || 'Failed to generate report');
        }
  
        navigation.navigate("ReportScreen", {
          ...reportData, // Pass report data to the report screen
        });
      } catch (error) {
        console.error('JSON Parsing error:', error);
        throw new Error(`Invalid response format: ${text}`);
      }
    } catch (error) {
      console.error("❌ Report generation failed:", error);
      Alert.alert('Error', error.message);
    }
  };
  
  
  
  
  return (
    <View style={styles.container}>
      <View style={styles.topDesign} />
      <View style={[styles.topDesign, styles.orangeCircle]} />

      <Text style={styles.heading}>Citrus Summary</Text>
      <Text style={styles.subHeading}>Total Citrus Count</Text>
      <Text style={styles.count}>{citrusCount !== null ? `Total Count: ${citrusCount}` : 'Loading...'}</Text>

      <Text style={styles.historyHeading}>Previous History</Text>
      <FlatList
  data={history}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <Text style={styles.historyItem}>
      {item.date} | {item.citrusCount}
    </Text>
  )}
/>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleGenerateReport}>
          <Text style={styles.buttonText}>Generate Report</Text>
        </TouchableOpacity>

        <TouchableOpacity 
  style={styles.button} 
  onPress={() => BackHandler.exitApp()}
>
  <Text style={styles.buttonText}>Exit App</Text>
</TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 27, fontWeight: 'bold', color: '#2a7e19', marginBottom: 10, marginTop: 80, textTransform: 'uppercase', letterSpacing: 1, textShadowColor: 'rgba(11, 11, 11, 0.3)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5 },
  subHeading: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  count: { fontSize: 16, marginBottom: 20 },
  historyHeading: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  historyItem: { fontSize: 16, marginVertical: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 100 },
  button: { backgroundColor: '#2a7e19', padding: 12, borderRadius: 8, width: '45%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  topDesign: { position: 'absolute', width: 100, height: 100, backgroundColor: 'green', borderRadius: 50, top: -20, left: -20 },
  orangeCircle: { backgroundColor: 'orange', right: -30, left: 'auto' }
});

export default SummaryScreen;
