import React from "react";

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Developer Room</Text>

      <Text style={styles.subtitle}>Your personal development assistant</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Projects")}
      >
        <Text style={styles.cardTitle}>Projects</Text>

        <Text style={styles.cardText}>View and manage your projects</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Chat")}
      >
        <Text style={styles.cardTitle}>AI Assistant</Text>

        <Text style={styles.cardText}>Ask your AI about your development</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 40,
  },

  subtitle: {
    fontSize: 15,
    color: "#666666",
    marginTop: 8,
    marginBottom: 30,
  },

  card: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dddddd",
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  cardText: {
    marginTop: 5,
    color: "#666666",
  },
});

export default HomeScreen;
