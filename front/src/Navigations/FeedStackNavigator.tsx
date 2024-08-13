// FeedStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Feed from '../components/Feed';
import QRCodeScannerScreen from '../components/QRCodeScannerScreen';

const Stack = createStackNavigator();

function FeedStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Feed" component={Feed} options={{ headerShown: false }} />
      <Stack.Screen name="QRCodeScanner" component={QRCodeScannerScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default FeedStackNavigator;
