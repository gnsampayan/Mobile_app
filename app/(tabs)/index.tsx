import { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ListItem from '../components/ListItem';
import { useListItems } from '../hooks/useListItems';
import { generateUUID } from '../utils/uuid';
import { ListItem as ListItemType } from '../types';
import styles from '../../styles';
import { ListRenderItem } from 'react-native';

export default function HomeScreen() {
  const { listItems, setListItems, saveListItems } = useListItems();
  const [newListItemName, setNewListItemName] = useState('');
  const [nestedItemName, setNestedItemName] = useState<{ [key: string]: string }>({});

  const addListItem = () => {
    if (newListItemName.trim()) {
      const newItem: ListItemType = { id: generateUUID(), key: newListItemName };
      const updatedListItems = [...listItems, newItem];
      setListItems(updatedListItems);
      saveListItems(updatedListItems);
      setNewListItemName('');
    }
  };

  const addNestedListItem = (parentId: string) => {
    const nestedItemNameValue = nestedItemName[parentId]?.trim();
    if (nestedItemNameValue) {
      const recursivelyAddNestedItem = (items: ListItemType[]): ListItemType[] => {
        return items.map(item => {
          if (item.id === parentId && item.isObject) {
            const newNestedItem: ListItemType = { id: generateUUID(), key: nestedItemNameValue };
            return {
              ...item,
              items: [...(item.items || []), newNestedItem]
            };
          } else if (item.items) {
            return { ...item, items: recursivelyAddNestedItem(item.items) };
          }
          return item;
        });
      };

      const updatedListItems = recursivelyAddNestedItem(listItems);
      setListItems(updatedListItems);
      saveListItems(updatedListItems);
      setNestedItemName({ ...nestedItemName, [parentId]: '' });
    }
  };

  const deleteListItem = (id: string) => {
    const recursivelyDeleteNestedItems = (items: ListItemType[]): ListItemType[] => {
      return items.map(item => {
        if (item.items) {
          item.items = recursivelyDeleteNestedItems(item.items);
        }
        return item;
      }).filter(item => item.id !== id);
    };
    const updatedListItems = recursivelyDeleteNestedItems(listItems);
    setListItems(updatedListItems);
    saveListItems(updatedListItems);
  };

  const clearChildren = (item: ListItemType) => {
    const recursivelyClearChildren = (items: ListItemType[]): ListItemType[] => {
      return items.map(listItem => {
        if (listItem.id === item.id) {
          return { ...listItem, items: [] };
        } else if (listItem.items) {
          return { ...listItem, items: recursivelyClearChildren(listItem.items) };
        }
        return listItem;
      });
    };

    const updatedListItems = recursivelyClearChildren(listItems);
    setListItems(updatedListItems);
    saveListItems(updatedListItems);
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity style={styles.editButton} onPress={() => handleEditItem(id, '')}>
      <Ionicons name="pencil" size={20} color="white" />
    </TouchableOpacity>
  );

  const handleLongPress = (item: ListItemType) => {
    if (item.isObject) {
      Alert.alert(
        "Clear Children",
        "Do you want to clear all children of this list object?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: () => clearChildren(item)
          }
        ]
      );
    } else {
      Alert.alert(
        "Convert to List Object",
        "Do you want to turn this list item into a list object?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: () => convertToListObject(item)
          }
        ]
      );
    }
  };

  const convertToListObject = (item: ListItemType) => {
    const recursivelyConvertToListObject = (items: ListItemType[]): ListItemType[] => {
      return items.map(listItem => {
        if (listItem.id === item.id) {
          return { ...listItem, isObject: true, items: [], showDropdown: false };
        } else if (listItem.items) {
          return { ...listItem, items: recursivelyConvertToListObject(listItem.items) };
        }
        return listItem;
      });
    };

    const updatedListItems = recursivelyConvertToListObject(listItems);
    setListItems(updatedListItems);
    saveListItems(updatedListItems); // Save the updated list items to AsyncStorage
  };

  const toggleDropdown = (id: string) => {
    const recursivelyToggleDropdown = (items: ListItemType[]): ListItemType[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, showDropdown: !item.showDropdown };
        } else if (item.items) {
          return { ...item, items: recursivelyToggleDropdown(item.items) };
        }
        return item;
      });
    };

    const updatedListItems = recursivelyToggleDropdown(listItems);
    setListItems(updatedListItems);
  };

  const handleEditItem = (id: string, newText: string) => {
    const recursivelyEditItem = (items: ListItemType[]): ListItemType[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, key: newText };
        } else if (item.items) {
          return { ...item, items: recursivelyEditItem(item.items) };
        }
        return item;
      });
    };

    const updatedListItems = recursivelyEditItem(listItems);
    setListItems(updatedListItems);
    saveListItems(updatedListItems);
  };

  const renderItem: ListRenderItem<ListItemType> = ({ item, index }) => (
    <ListItem
      item={item}
      index={index}
      nestedItemName={nestedItemName}
      setNestedItemName={setNestedItemName}
      addNestedListItem={addNestedListItem}
      toggleDropdown={toggleDropdown}
      renderRightActions={renderRightActions}
      layerIndex={[index]}
      handleEditItem={handleEditItem}
      deleteListItem={deleteListItem}
      handleLongPress={handleLongPress}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity onPress={addListItem}>
          <Ionicons name="add-circle-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter list item name"
        placeholderTextColor="gray"
        value={newListItemName}
        onChangeText={setNewListItemName}
        onSubmitEditing={addListItem}
      />
      <FlatList
        data={listItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}
