import { useState, useRef } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, FlatList, Alert, KeyboardAvoidingView, Platform, } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ListItem from '../components/ListItem';
import { useListItems } from '@/app/context/listItemsContext';
import { generateUUID } from '../utils/uuid';
import { ListItem as ListItemType } from '../types';
import styles from '../../styles';
import { ListRenderItem } from 'react-native';
import { useActiveList } from '@/app/context/activeListContext';

export default function HomeScreen() {
  const { activeList } = useActiveList();
  const { listItems, setListItems, saveListItems } = useListItems();
  const activeListItem = listItems.find(item => item.id === activeList) || { id: 'default', key: 'default', items: [] };
  const [newListItemName, setNewListItemName] = useState('');
  const [nestedItemName, setNestedItemName] = useState<{ [key: string]: string }>({});
  const flatListRef = useRef<FlatList>(null);

  const addListItem = () => {
    if (newListItemName.trim()) {
      const newItem: ListItemType = { id: generateUUID(), key: newListItemName };
      const updatedListItems = listItems.map(item => {
        if (item.id === activeList) {
          return { ...item, items: [...(item.items || []), newItem] };
        }
        return item;
      });
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
              items: [...(item.items || []), newNestedItem],
            };
          } else if (item.items) {
            return { ...item, items: recursivelyAddNestedItem(item.items) };
          }
          return item;
        });
      };
      const updatedActiveListItems = recursivelyAddNestedItem(activeListItem.items || []);
      const updatedListItems = listItems.map(listItem => {
        if (listItem.id === activeList) {
          return { ...listItem, items: updatedActiveListItems };
        }
        return listItem;
      });
      setListItems(updatedListItems);
      saveListItems(updatedListItems);
      setNestedItemName({ ...nestedItemName, [parentId]: '' });
    }
  };

  const deleteListItem = (id: string) => {
    const recursivelyDeleteNestedItems = (items: ListItemType[]): ListItemType[] => {
      return items
        .filter(item => item.id !== id)
        .map(item => {
          if (item.items) {
            return { ...item, items: recursivelyDeleteNestedItems(item.items) };
          }
          return item;
        });
    };

    const updatedActiveListItems = recursivelyDeleteNestedItems(activeListItem.items || []);
    const updatedListItems = listItems.map(listItem => {
      if (listItem.id === activeList) {
        return { ...listItem, items: updatedActiveListItems };
      }
      return listItem;
    });

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

    const updatedActiveListItems = recursivelyClearChildren(activeListItem.items || []);
    const updatedListItems = listItems.map(listItem => {
      if (listItem.id === activeList) {
        return { ...listItem, items: updatedActiveListItems };
      }
      return listItem;
    });

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

    const updatedActiveListItems = recursivelyConvertToListObject(activeListItem.items || []);
    const updatedListItems = listItems.map(listItem => {
      if (listItem.id === activeList) {
        return { ...listItem, items: updatedActiveListItems };
      }
      return listItem;
    });

    setListItems(updatedListItems);
    saveListItems(updatedListItems);
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

    const updatedActiveListItems = recursivelyToggleDropdown(activeListItem.items || []);
    const updatedListItems = listItems.map(listItem => {
      if (listItem.id === activeList) {
        return { ...listItem, items: updatedActiveListItems };
      }
      return listItem;
    });

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

    const updatedActiveListItems = recursivelyEditItem(activeListItem.items || []);
    const updatedListItems = listItems.map(listItem => {
      if (listItem.id === activeList) {
        return { ...listItem, items: updatedActiveListItems };
      }
      return listItem;
    });

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
      flatListRef={flatListRef}
    />
  );


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{activeListItem.key || 'Home'}</Text>
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
          ref={flatListRef}
          data={activeListItem.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.flatListContentContainer}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
