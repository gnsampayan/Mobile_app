import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveActiveList = async (activeListId: string) => {
  try {
    await AsyncStorage.setItem('activeList', activeListId);
  } catch (error) {
    console.error('Failed to save active list', error);
  }
};

export const loadActiveList = async (): Promise<string | null> => {
  try {
    const activeListId = await AsyncStorage.getItem('activeList');
    return activeListId;
  } catch (error) {
    console.error('Failed to load active list', error);
    return null;
  }
};
