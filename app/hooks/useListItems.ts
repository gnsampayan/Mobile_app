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
      if (storedListItems) {
        const parsedListItems: ListItem[] = JSON.parse(storedListItems);
        // Ensure showDropdown is false by default
        const updatedListItems = parsedListItems.map(item => ({
          ...item,
          showDropdown: false, // Ensure showDropdown is false by default
          items: item.items?.map(nestedItem => ({
            ...nestedItem,
            showDropdown: false, // Ensure nested items also have showDropdown set to false
          })) || [],
        }));
        setListItems(updatedListItems);
      }
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
