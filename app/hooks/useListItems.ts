import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem } from '../types';

export const useListItems = () => {
  const [listItems, setListItems] = useState<ListItem[]>([]);

  useEffect(() => {
    loadListItems();
  }, []);

  const loadListItems = async () => {
    try {
      const storedListItems = await AsyncStorage.getItem('listItems');
      let parsedListItems: ListItem[] = storedListItems ? JSON.parse(storedListItems) : [];
      if (parsedListItems.length === 0) {
        parsedListItems = [{ id: 'default', key: 'default', items: [] }];
      }
      setListItems(parsedListItems);
    } catch (error) {
      console.error('Failed to load list items', error);
    }
  };

  const saveListItems = async (items: ListItem[]) => {
    try {
      await AsyncStorage.setItem('listItems', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save list items', error);
    }
  };

  return { listItems, setListItems, saveListItems };
};
