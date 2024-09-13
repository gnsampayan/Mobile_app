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
        <View style={[styles.profileContainer, { width: screenWidth, height: 100 }]}>
          <ThemedText type="title" style={styles.profileText}>Profile</ThemedText>
        </View>
        <View style={[styles.listsContainer, { width: screenWidth }]}>
          <ThemedText type="title" style={styles.listsText}>Lists</ThemedText>
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Active</ThemedText>
            <View style={styles.activeContainer}>
              <ThemedText>{listItems.find(item => item.id === activeList)?.key || 'default'}</ThemedText>
            </View>
          </View>
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Library</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter list name"
              placeholderTextColor="gray"
              value={newListName}
              onChangeText={setNewListName}
              onSubmitEditing={addList}
            />
            <TouchableOpacity onPress={addList}>
              <Ionicons name="add-circle-outline" size={32} color="black" />
            </TouchableOpacity>
            <FlatList
              data={listItems}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectActiveList(item.id)}
                  onLongPress={() => handleLongPress(item.id)}
                >
                  <ThemedText style={styles.listItem}>{item.key}</ThemedText>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
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
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#D0D0D0',
    paddingLeft: 20,
  },
  profileText: {
    fontSize: 20,
    color: '#000',
  },
  listsContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#E0E0E0',
    paddingLeft: 20,
    paddingTop: 10,
    flex: 1,
    paddingRight: 20,
  },
  listsText: {
    fontSize: 20,
    color: '#000',
  },
  section: {
    marginTop: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  activeContainer: {
    backgroundColor: '#C0C0C0',
    padding: 10,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    color: 'black',
    backgroundColor: 'white',
    width: '90%',
  },
  listItem: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    marginTop: 5,
    color: 'black',
  },
  activeText: {
    color: 'black',
  },
});
