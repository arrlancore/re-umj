import { AsyncStorage } from 'react-native';

const userData = async () => {
  const user = await AsyncStorage.getItem('user');
  return JSON.parse(user);
};

export default userData;
