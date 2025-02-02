// NotificationsModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import { colors } from '../constants/color';

interface NotificationsModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ modalVisible, setModalVisible }) => {
  const notifications = [
    { id: '1', message: '새로운 알림이 없어요' },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>알림 내역</Text>
          {notifications.length === 0 ? (
            <Text style={styles.emptyText}>알림이 없습니다.</Text>
          ) : (
            <FlatList
              data={notifications}
              renderItem={({ item }) => <Text style={styles.notificationText}>{item.message}</Text>}
              keyExtractor={(item) => item.id}
            />
          )}
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%', // 너비를 90%로 설정
    height: '50%', // 높이를 화면의 1/2로 설정
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    color: colors.GRAY_500,
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: colors.BLUE_250,
  },
  textStyle: {
    color: colors.WHITE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NotificationsModal;
