import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function OptionsScreen() {
  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={[styles.profileContainer, { width: screenWidth, height: 100 }]}>
          <ThemedText type="title" style={styles.profileText}>Profile</ThemedText>
        </View>
        <View style={[styles.listsContainer, { width: screenWidth, height: 100 }]}>
          <ThemedText type="title" style={styles.listsText}>Lists</ThemedText>
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
    fontSize: 20, // Example style, adjust as needed
    color: '#000', // Example style, adjust as needed
  },
  listsContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#E0E0E0', // Adjust the background color as needed
    paddingLeft: 20,
    marginTop: 10, // Add some space between the views
  },
  listsText: {
    fontSize: 20, // Example style, adjust as needed
    color: '#000', // Example style, adjust as needed
  },
});
