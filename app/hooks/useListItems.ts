import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem } from '../types';
import { DEFAULT_LIST } from '../context/defaultList';

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
        parsedListItems = [DEFAULT_LIST];
      }

      // Reset showDropdown to false for all items
      const resetDropdownState = (items: ListItem[]): ListItem[] => {
        return items.map(item => ({
          ...item,
          showDropdown: false,
          items: item.items ? resetDropdownState(item.items) : [],
        }));
      };

      parsedListItems = resetDropdownState(parsedListItems);
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
