import React from "react";

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ProjectScreen = ({ route, navigation }) => {
  const project = route.params.project;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{project}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Chat", {
            project,
          })
        }
      >
        <Text style={styles.buttonText}>Ask AI</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Chat", {
            project,
            initialMessage: "Show me the Git status of this project",
          })
        }
      >
        <Text style={styles.buttonText}>Git Status</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Chat", {
            project,
            initialMessage: "Run the tests for this project",
          })
        }
      >
        <Text style={styles.buttonText}>Run Tests</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Chat", {
            project,
            initialMessage: "Start the development server",
          })
        }
      >
        <Text style={styles.buttonText}>Start Dev Server</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 25,
  },

  button: {
    padding: 16,
    backgroundColor: "#222222",
    borderRadius: 10,
    marginBottom: 12,
  },

  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default ProjectScreen;
