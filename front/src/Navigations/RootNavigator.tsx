// RootNavigator.tsx

import React from 'react';
import { StyleSheet } from 'react-native';
import StackNavigator from './StackNavigator';
import useAuth from '../hooks/queries/useAuth';
import TabNavigator from './TabNavigator';

function RootNavigator() {
  // const { isLogin } = useAuth();
  
  return <StackNavigator />;
}

const styles = StyleSheet.create({});

export default RootNavigator;
