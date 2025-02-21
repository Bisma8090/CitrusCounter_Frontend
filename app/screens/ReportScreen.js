import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const ReportScreen = ({ route }) => {
  const { date, farmerName, location, citrusPerTree, totalTrees } = route.params || {};
  const citrusPerAcre = citrusPerTree * totalTrees;

  const generatePDF = async () => {
    console.log('⚡ generatePDF function called');

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
            <p><strong>Citrus Count Per Tree:</strong> ${citrusPerTree}</p>
            <p><strong>Citrus Count Per Acre:</strong> ${citrusPerAcre}</p>
          </body>
        </html>
      `;

      console.log('✅ HTML Content Generated:', htmlContent);

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      console.log('✅ PDF saved at:', uri);
      await shareAsync(uri);
    } catch (error) {
      console.error('❌ Error Generating PDF:', error);
      Alert.alert('Error', `Failed to generate PDF: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Citrus Detection Report</Text>
      <Text style={styles.detail}><Text style={styles.label}>Date:</Text> {date}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Farmer Name:</Text> {farmerName}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Location:</Text> {location}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Citrus Count Per Tree:</Text> {citrusPerTree}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Citrus Count Per Acre:</Text> {citrusPerAcre}</Text>

      <TouchableOpacity style={styles.button} onPress={() => {
        console.log('📌 Button Clicked!');
        generatePDF();
      }}>
        <Text style={styles.buttonText}>Download Report</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#2a7e19', textAlign: 'center', marginBottom: 20 },
  detail: { fontSize: 16, marginBottom: 10 },
  label: { fontWeight: 'bold' },
  button: { backgroundColor: '#2a7e19', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default ReportScreen;
