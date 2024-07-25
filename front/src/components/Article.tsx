import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/queries/useAuth';

function Article() {
  const { logout } = useAuth();
  const navigation = useNavigation();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <Text>Article Screen</Text>
      <Button title="로그아웃" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Article;
