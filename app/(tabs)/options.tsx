import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Text, Dimensions, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useListItems } from '@/app/context/listItemsContext';
import { generateUUID } from '@/app/utils/uuid';
import { useActiveList } from '@/app/context/activeListContext';

export default function OptionsScreen() {
  const screenWidth = Dimensions.get('window').width;
  const { listItems, setListItems, saveListItems } = useListItems();
  const [newListName, setNewListName] = useState('');
  const { activeList, setActiveList } = useActiveList();

  const addList = () => {
    if (newListName.trim()) {
      const newList = { id: generateUUID(), key: newListName, items: [] };
      const updatedListItems = [...listItems, newList];
      setListItems(updatedListItems);
      saveListItems(updatedListItems);
      setNewListName('');
    }
  };

  const selectActiveList = (id: string) => {
    setActiveList(id);
  };

  const deleteList = (id: string) => {
    const updatedListItems = listItems.filter(item => item.id !== id);
    setListItems(updatedListItems);
    saveListItems(updatedListItems);
    if (activeList === id) {
      const newActiveList = updatedListItems.length > 0 ? updatedListItems[0].id : 'default';
      setActiveList(newActiveList);
    }
  };

  const handleLongPress = (id: string) => {
    Alert.alert(
      "Delete List",
      "Are you sure you want to delete this list and all its contents?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteList(id),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={[styles.listsContainer, { width: screenWidth }]}>
          <ThemedText type="title" style={styles.listsText}>List Options</ThemedText>
          <View style={styles.activeListSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Active</ThemedText>
            <View style={styles.activeContainer}>
              <ThemedText>{listItems.find(item => item.id === activeList)?.key || 'default'}</ThemedText>
            </View>
          </View>
          <View style={[styles.section, styles.librarySection]}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Library</ThemedText>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Create a new list"
                placeholderTextColor="gray"
                value={newListName}
                onChangeText={setNewListName}
                onSubmitEditing={addList}
              />
              <TouchableOpacity onPress={addList} style={styles.addButton}>
                <Ionicons name="add-circle-outline" size={32} color="black" />
              </TouchableOpacity>
            </View>
            <FlatList
              style={styles.listContainer}
              data={listItems}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.listItem, item.id === activeList && styles.activeList]}
                  onPress={() => selectActiveList(item.id)}
                  onLongPress={() => handleLongPress(item.id)}
                >
                  <ThemedText style={[styles.listItemText, item.id === activeList && styles.activeText]}>{item.key}</ThemedText>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              // Make the FlatList take up available space and be scrollable
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#383838',
    paddingBottom: -34,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  listsContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#E0E0E0',
    paddingLeft: 20,
    paddingTop: 20,
    flex: 1,
    paddingRight: 20,
    height: '100%',
    marginBottom: 0,
    paddingBottom: 0,
  },
  listsText: {
    fontSize: 20,
    color: '#000',
  },
  activeListSection: {
    marginTop: 20,
    width: '100%',
    display: 'flex',
  },
  section: {
    marginTop: 20,
    width: '100%',
    display: 'flex',
    flex: 1,
  },
  librarySection: {
    // Additional styles if needed
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  addButton: {
    marginLeft: 10,
  },
  listContainer: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  activeContainer: {
    backgroundColor: '#242424',
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 6,
  },
  listItem: {
    padding: 10,
    backgroundColor: '#efefef',
    marginTop: 5,
    borderRadius: 6,
  },
  listItemText: {
    color: 'black',
  },
  activeList: {
    backgroundColor: '#242424',
  },
  activeText: {
    color: 'white',
  },
});
