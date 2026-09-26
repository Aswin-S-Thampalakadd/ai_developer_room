import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ChatBubble = ({ message, isUser }) => {
  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
    >
      <Text style={[styles.text, isUser && styles.userText]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 5,
    marginHorizontal: 12,
    borderRadius: 12,
    maxWidth: "85%",
  },

  userContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#222222",
  },

  aiContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#eeeeee",
  },

  text: {
    color: "#000000",
    fontSize: 15,
  },

  userText: {
    color: "#ffffff",
  },
});

export default ChatBubble;
