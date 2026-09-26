import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveItem = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getItem = async (key) => {
  const value = await AsyncStorage.getItem(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value);
};

export const removeItem = async (key) => {
  await AsyncStorage.removeItem(key);
};
