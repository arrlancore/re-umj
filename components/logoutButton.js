import React from 'react';
import { object } from 'prop-types';
import { Button } from 'react-native-paper';
import { AsyncStorage, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import { AuthContext } from '../Context';

const Logout = props => {
  const { setLogin } = React.useContext(AuthContext);
  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLogin');
    await AsyncStorage.removeItem('user');
    setLogin(false);
    props.navigation.push('Login');
  };
  return (
    <Button onPress={handleLogout}>
      <Text style={{ color: '#efefef', position: 'relative', marginRight: 6 }}>
        sign out
      </Text>
    </Button>
  );
};

Logout.propTypes = { navigation: object };

export default withNavigation(Logout);
