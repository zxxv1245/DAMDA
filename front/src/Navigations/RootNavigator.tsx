import React from 'react';
import { StyleSheet } from 'react-native';
import DrawerNavigator from './DrawerNavigator';
import StackNavigator from './StackNavigator';
import useAuth from '../hooks/queries/useAuth';

function RootNavigator() {
  const { isLogin } = useAuth();
  
  return <>{isLogin ? <DrawerNavigator /> : <StackNavigator />}</>;
}

const styles = StyleSheet.create({});

export default RootNavigator;
