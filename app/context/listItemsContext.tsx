import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem } from '../types';
import { DEFAULT_LIST } from './defaultList';

interface ListItemsContextType {
    listItems: ListItem[];
    setListItems: (items: ListItem[]) => void;
    saveListItems: (items: ListItem[]) => Promise<void>;
}

const ListItemsContext = createContext<ListItemsContextType | undefined>(undefined);

export const ListItemsProvider = ({ children }: { children: ReactNode }) => {
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

    return (
        <ListItemsContext.Provider value={{ listItems, setListItems, saveListItems }}>
            {children}
        </ListItemsContext.Provider>
    );
};

export const useListItems = () => {
    const context = useContext(ListItemsContext);
    if (!context) {
        throw new Error('useListItems must be used within a ListItemsProvider');
    }
    return context;
};
