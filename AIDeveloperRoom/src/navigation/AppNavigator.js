import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ProjectsScreen from "../screens/ProjectsScreen";
import ProjectScreen from "../screens/ProjectScreen";
import ChatScreen from "../screens/ChatScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Projects" component={ProjectsScreen} />

        <Stack.Screen name="Project" component={ProjectScreen} />

        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            title: "AI Assistant",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
