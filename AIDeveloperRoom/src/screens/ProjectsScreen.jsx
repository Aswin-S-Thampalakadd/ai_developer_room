import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { sendAIMessage } from "../api/api.js";

const ProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await sendAIMessage("Show me my available projects");

      const projectText = response.response || "";

      const projectList = projectText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("-"))
        .map((line) => ({
          name: line.replace(/^-\s*/, ""),
        }));

      setProjects(projectList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projects</Text>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.project}
            onPress={() =>
              navigation.navigate("Project", {
                project: item.name,
              })
            }
          >
            <Text style={styles.projectName}>{item.name}</Text>

            <Text>Open project</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },

  project: {
    padding: 18,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 12,
    marginBottom: 12,
  },

  projectName: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 5,
  },
});

export default ProjectsScreen;
