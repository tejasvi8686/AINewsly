import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Recommended for Reanimated/Gesture handling eventually
import NewsFeedScreen from './screens/NewsFeedScreen';

export default function App() {
  // GestureHandlerRootView is good practice with modern RN apps especially if using libraries that might need it later, 
  // though we aren't using gesture-handler explicitly yet, reanimated works better with it sometimes.
  // Actually, standard View is fine unless we have gesture interactions.

  return (
    <View style={styles.container}>
      <NewsFeedScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
