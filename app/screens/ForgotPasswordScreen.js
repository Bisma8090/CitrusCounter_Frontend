import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";

const ForgotPasswordScreen = ({ route }) => {
  const userFullName = route?.params?.fullName || "Your Name"; // Fetch from navigation params or storage
  const userPhone = route?.params?.phoneNumber || "Your Phone"; // Fetch from navigation params or storage

  const sendWhatsAppMessage = () => {
    const message = `Forgot Password Request:\nFull Name: ${userFullName}\nRegistered Phone Number: ${userPhone}`;
    const whatsappNumber = "03229259925"; // Replace with admin's number
    const url = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      alert("Make sure WhatsApp is installed on your device.");
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        If you forgot your password, click the button below to contact admin via WhatsApp.
      </Text>

      <TouchableOpacity style={styles.button} onPress={sendWhatsAppMessage}>
        <Text style={styles.buttonText}>Contact Admin on WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  infoText: { fontSize: 16, color: "#333", textAlign: "center", marginBottom: 20 },
  button: { backgroundColor: "#25D366", padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default ForgotPasswordScreen;
