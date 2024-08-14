import React from 'react';
import {StyleSheet, View,Text,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/color';
import { useNavigation } from '@react-navigation/native';
import { stackNavigations } from '../constants';

interface ServiceInformationProps {

}

function ServiceInformation({}: ServiceInformationProps) {
  const navigation = useNavigation();

  const handleServiceScreenPress = () => {
    navigation.navigate(stackNavigations.SERVICESCREEN);
  };

  const handleCommonQuestionPress = () => {
    navigation.navigate(stackNavigations.COMMONQUESTION);
  };

  const handleMyQnAPress = () => {
    navigation.navigate(stackNavigations.MYQNA);
  };

  return (
    <View style= {styles.container}>
      <View style={styles.verticalMenu}>
        <TouchableOpacity style={styles.verticalMenuItem} onPress={handleServiceScreenPress}>
          <View style={styles.verticalMenuTextContainer}>
            <Icon name="information-circle-outline" size={20} color={colors.BLACK} style={styles.verticalMenuIcon} />
            <Text style={styles.verticalMenuText}>서비스 기능</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color={colors.BLACK} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.verticalMenuItem} onPress={handleCommonQuestionPress}>
          <View style={styles.verticalMenuTextContainer}>
            <Icon name="notifications-outline" size={20} color={colors.BLACK} style={styles.verticalMenuIcon} />
            <Text style={styles.verticalMenuText}>자주 묻는 질문</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color={colors.BLACK} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.verticalMenuItem} onPress={handleMyQnAPress}>
          <View style={styles.verticalMenuTextContainer}>
            <Icon name="person-outline" size={20} color={colors.BLACK} style={styles.verticalMenuIcon} />
            <Text style={styles.verticalMenuText}>내 Q & A</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color={colors.BLACK} />
        </TouchableOpacity>
      </View>
      <Text style = {styles.ServiceText}>추가 문의 사항이 있다면 (010-6394-6129) 로 문의 주세요.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  verticalMenu: {
    borderRadius: 10,
  },
  verticalMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_400,
  },
  verticalMenuTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalMenuText: {
    fontSize: 16,
    color: colors.BLACK,
    marginLeft: 10,
  },
  verticalMenuIcon: {
    marginRight: 10,
  },
  ServiceText : {
    textAlign : 'center',
    marginTop : 20
  }
});

export default ServiceInformation;