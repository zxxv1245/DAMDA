import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainStackNavigator from './MainStackNavigator';
import { stackNavigations } from '../constants';

function DrawerNavigator() {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitle: '담다',
        headerTitleAlign: 'center',
      }}
    >
      <Drawer.Screen name="Main" component={MainStackNavigator} />
      <Drawer.Screen name={stackNavigations.ARTICLE} component={Article} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
