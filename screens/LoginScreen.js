import React from 'react';
import { object } from 'prop-types';
import axios from 'axios';
import config from '../config';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  AsyncStorage
} from 'react-native';
import { AuthContext, usePrevious } from '../Context';
import { Button, TextInput, Title } from 'react-native-paper';

const LogoImage = require('../assets/images/logo.png');

export default function HomeScreen(props) {
  const { login, setLogin, setUser } = React.useContext(AuthContext);
  const [values, setValues] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const { navigate } = props.navigation;

  const prevLogin = usePrevious(login);
  React.useEffect(() => {
    if (login && !prevLogin) navigate('Homepage');
  });

  const setValue = key => value => {
    setValues({ ...values, [key]: value });
  };

  const userLogin = async () => {
    setLoading(true);
    const url = config.baseUrl + '/api/auth/login';
    try {
      const response = await axios.post(url, values, { timeout: 30000 });
      let { data, token, jadwal } = response.data;
      if (data.role === 'staf') {
        throw new Error('You dont have permission to access this resource');
      }
      if (response.status <= 201) {
        const user = {
          token: token,
          jadwal,
          ...data
        };
        AsyncStorage.setItem('isLogin', 'true');
        AsyncStorage.setItem('user', JSON.stringify(user));
        setLogin(true);
        setUser(user);
        setLoading(false);
      } else {
        throw new Error('An error has been occured during the login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Title>Login</Title>
        <View style={styles.wrapImage}>
          <Image style={{ width: 120, height: 120 }} source={LogoImage} />
        </View>

        <TextInput
          onChangeText={value => setValue('email')(value)}
          style={styles.inputStyle}
          mode="flat"
          label="Email"
          value={values.email}
        />
        <TextInput
          onChangeText={value => setValue('password')(value)}
          style={styles.inputStyle}
          mode="flat"
          label="Password"
          value={values.password}
          secureTextEntry={true}
        />
        <Button
          contentStyle={{ marginTop: 5 }}
          style={styles.buttonStyle}
          mode="contained"
          loading={loading}
          onPress={userLogin}
          disabled={true}
        >
          Login
        </Button>
      </ScrollView>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null
};

HomeScreen.propTypes = {
  navigation: object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 30,
    marginLeft: 10,
    marginRight: 10
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)'
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center'
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center'
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center'
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7'
  },
  inputStyle: {
    marginTop: 20
  },
  buttonStyle: {
    marginTop: 20,
    height: 50,
    lineHeight: 50
  },
  wrapImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40
  }
});
