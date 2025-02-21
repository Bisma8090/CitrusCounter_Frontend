import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SummaryScreen = ({ route }) => {
  const navigation = useNavigation();
  const { location, totalTrees } = route.params || {};
  const [citrusCount, setCitrusCount] = useState(null);
  const [history, setHistory] = useState([]);
  const [farmerName, setFarmerName] = useState(''); // To be fetched from API

  useEffect(() => {
    fetchFarmerName();
    fetchCitrusCount();
    fetchHistory();
  }, []);

  const fetchFarmerName = async () => {
    try {
      const response = await fetch('YOUR_BACKEND_API_FOR_USER_DETAILS');
      const data = await response.json();
      setFarmerName(data.name);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch farmer name');
    }
  };

  const fetchCitrusCount = async () => {
    try {
      const response = await fetch('YOUR_CITRUS_COUNT_API');
      const data = await response.json();
      setCitrusCount(data.count);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch citrus count');
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('YOUR_HISTORY_API');
      const data = await response.json();
      setHistory(data.history);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch history');
    }
  };

  const citrusPerAcre = citrusCount * totalTrees;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Citrus Detection Summary</Text>
      <Text style={styles.subHeading}>Total Citrus Count</Text>
      <Text style={styles.count}>{citrusCount !== null ? `Total Count: ${citrusCount}` : 'Loading...'}</Text>
      
      <Text style={styles.historyHeading}>Previous History</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.historyItem}>{item.date} | {item.count}</Text>
        )}
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('ReportScreen', { 
            date: new Date().toLocaleDateString(),
            farmerName,
            location,
            citrusPerTree: citrusCount,
            totalTrees,
          })}
        >
          <Text style={styles.buttonText}>Generate Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Exit', 'App will close')}>
          <Text style={styles.buttonText}>Exit App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#2a7e19', marginBottom: 10 },
  subHeading: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  count: { fontSize: 16, marginBottom: 20 },
  historyHeading: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  historyItem: { fontSize: 16, marginVertical: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  button: { backgroundColor: '#2a7e19', padding: 12, borderRadius: 8, width: '45%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default SummaryScreen;
