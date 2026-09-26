import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { sendAIMessage } from "../api/api.js";
import ChatBubble from "../components/ChatBubble.jsx";

const ChatScreen = ({ route }) => {
  const project = route?.params?.project || null;

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const text = input.trim();

    if (!text || loading) {
      return;
    }

    setInput("");

    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-user`,
        message: text,
        isUser: true,
      },
    ]);

    setLoading(true);

    try {
      const response = await sendAIMessage(text, project);

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-ai`,
          message: response.response || "No response",
          isUser: false,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          message:
            error?.response?.data?.message ||
            error.message ||
            "Something went wrong",
          isUser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble message={item.message} isUser={item.isUser} />
        )}
        contentContainerStyle={styles.messages}
      />

      {loading && <ActivityIndicator style={styles.loader} />}

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask your AI..."
          style={styles.input}
          multiline
        />

        <TouchableOpacity onPress={sendMessage} style={styles.button}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  messages: {
    paddingVertical: 12,
  },

  loader: {
    margin: 10,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },

  input: {
    flex: 1,
    minHeight: 45,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  button: {
    marginLeft: 8,
    backgroundColor: "#222222",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 10,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default ChatScreen;
