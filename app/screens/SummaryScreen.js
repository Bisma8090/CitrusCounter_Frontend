import React, { useState, useEffect } from 'react';
import { BackHandler, View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SummaryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const images = route.params?.images || [];

  const [userPhone, setUserPhone] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [citrusCount, setCitrusCount] = useState(null);
  const [history, setHistory] = useState([]);
  const [treesPerAcre, setTreesPerAcre] = useState(route.params?.totalTrees || null);
  const [historyLoading, setHistoryLoading] = useState(true); // NEW STATE

  // Load user data from AsyncStorage
  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (parsedData.name) setFarmerName(parsedData.name);
        if (parsedData.phone) setUserPhone(parsedData.phone);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data');
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchSummaryData = async () => {
    try {
      if (images.length !== 4) {
        Alert.alert('Error', 'Four images are required to fetch summary.');
        return;
      }

      setHistoryLoading(true); // Start loading

      const formData = new FormData();
      images.forEach((uri, index) => {
        formData.append('images', {
          uri,
          type: 'image/jpeg',
          name: `image${index + 1}.jpg`,
        });
      });

      if (userPhone) {
        formData.append('phone', userPhone);
      }

      const response = await fetch('https://citruscounter-production.up.railway.app/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const text = await response.text();
      const contentType = response.headers.get('content-type');

      if (!response.ok || !contentType?.includes('application/json')) {
        throw new Error(`Unexpected response: ${text}`);
      }

      const data = JSON.parse(text);
      if (data) {
        setCitrusCount(data.latest_count);
        const userHistory = data.previous_history.filter(item => item.phone === userPhone);
        setHistory(userHistory);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch summary data');
      console.error('Error fetching summary:', error);
    } finally {
      setHistoryLoading(false); // End loading
    }
  };

  useEffect(() => {
    if (userPhone && images.length === 4) {
      fetchSummaryData();
    }
  }, [userPhone, images]);

  const handleGenerateReport = async () => {
    const reportData = {
      date: new Date().toLocaleDateString(),
      farmerName: farmerName || 'N/A',
      citrusCountPerTree: citrusCount ?? 0,
      totalTrees: treesPerAcre ?? 0,
    };

    try {
      const response = await fetch('https://citruscounter-production.up.railway.app/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      const text = await response.text();
      const data = JSON.parse(text);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate report');
      }

      navigation.navigate('ReportScreen', reportData);
    } catch (error) {
      console.error('❌ Report generation failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topDesign} />
      <View style={[styles.topDesign, styles.orangeCircle]} />

      <Text style={styles.heading}>Citrus Summary</Text>
      <Text style={styles.subHeading}>Total Citrus Count</Text>
      <Text style={styles.count}>
        {citrusCount !== null ? ` Total Count: ${citrusCount}` : 'Loading...'}
      </Text>

      <Text style={styles.historyHeading}>Previous History</Text>
      {historyLoading ? (
        <Text style={{ fontSize: 16, marginVertical: 10, marginBottom: 222 }}>
          Loading previous history...
        </Text>
      ) : history.length === 0 ? (
        <Text style={{ fontSize: 16, marginVertical: 10, marginBottom: 222 }}>
          No previous history found
        </Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.historyItem}>
              {item.date} | {item.citrusCount}
            </Text>
          )}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleGenerateReport}>
          <Text style={styles.buttonText}>Generate Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => BackHandler.exitApp()}>
          <Text style={styles.buttonText}>Exit App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#2a7e19',
    marginBottom: 10,
    marginTop: 80,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(11, 11, 11, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subHeading: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  count: { fontSize: 16, marginBottom: 20 },
  historyHeading: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  historyItem: { fontSize: 16, marginVertical: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 100 },
  button: { backgroundColor: '#2a7e19', padding: 12, borderRadius: 8, width: '45%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  topDesign: { position: 'absolute', width: 100, height: 100, backgroundColor: 'green', borderRadius: 50, top: -20, left: -20 },
  orangeCircle: { backgroundColor: 'orange', right: -30, left: 'auto' },
});

export default SummaryScreen;
