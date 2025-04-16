import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const ReportScreen = ({ route }) => {
  console.log('ROUTE PARAMS:', route.params); // ✅ Log route params for debugging

  // Extract the location (and other data) from route params, providing a default value if missing
  const { date, farmerName, location = "Location not available", citrusCount } = route.params || {};
  console.log('LOCATION RECEIVED:', location); // Log the received location to ensure it's correct

  const generatePDF = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { text-align: center; color: #2a7e19; }
              p { font-size: 16px; margin: 5px 0; }
              strong { color: #333; }
            </style>
          </head>
          <body>
            <h1>Citrus Detection Report</h1>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Farmer Name:</strong> ${farmerName}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Citrus Count Per Tree:</strong> ${citrusCount}</p>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', `Failed to generate PDF: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topDesign} />
      <View style={[styles.topDesign, styles.orangeCircle]} />

      <Text style={styles.heading}>Citrus Report</Text>
      <Text style={styles.detail}><Text style={styles.label}>Date:</Text> {date}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Farmer Name:</Text> {farmerName}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Location:</Text> {location}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Citrus Count Per Tree:</Text> {citrusCount}</Text>

      <TouchableOpacity style={styles.button} onPress={generatePDF}>
        <Text style={styles.buttonText}>Download Report</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  heading: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#2a7e19',
    textAlign: 'center',
    marginBottom: 30,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(11, 11, 11, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5
  },
  detail: { fontSize: 16, marginBottom: 10, paddingLeft: 14 },
  label: { fontWeight: 'bold' },
  button: {
    backgroundColor: '#2a7e19',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  topDesign: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: 'green',
    borderRadius: 50,
    top: -20,
    left: -20
  },
  orangeCircle: { backgroundColor: 'orange', right: -30, left: 'auto' }
});

export default ReportScreen;
