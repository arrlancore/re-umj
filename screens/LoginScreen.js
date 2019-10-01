import React from 'react';
import { object } from 'prop-types';
import api from '../helper/api';
import Layout from '../components/layout';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  AsyncStorage
} from 'react-native';
import { AuthContext, usePrevious, SnackbarContext } from '../Context';
import { Button, TextInput, Title } from 'react-native-paper';

const LogoImage = require('../assets/images/logo-transparent.png');
const BgImage = require('../assets/images/bgapp.png');

export default function HomeScreen(props) {
  const { login, setLogin, setUser } = React.useContext(AuthContext);
  const [values, setValues] = React.useState({
    email: '2015477019@ftumj.ac.id',
    password: 'ftumj2019'
  });
  const [loading, setLoading] = React.useState(false);
  const { navigate } = props.navigation;
  const [, setSnackbar] = React.useContext(SnackbarContext);

  const prevLogin = usePrevious(login);
  React.useEffect(() => {
    if (login && !prevLogin) navigate('Home');
  });

  const setValue = key => value => {
    setValues({ ...values, [key]: value });
  };

  const buttonDisabled = () =>
    !!(
      values.email &&
      values.password &&
      values.email.length > 3 &&
      values.password.length > 5
    );

  const userLogin = async () => {
    setLoading(true);
    const pathApi = '/api/auth/login';
    try {
      const response = await api.post(pathApi, values, { timeout: 30000 });
      let { data, token, jadwal } = response.data;
      if (data.role === 'staf') {
        throw new Error('You dont have permission to access this resource');
      }
      if (response.status <= 201) {
        const user = {
          token: token,
          ...data
        };
        AsyncStorage.setItem('isLogin', 'true');
        AsyncStorage.setItem('user', JSON.stringify(user));
        AsyncStorage.setItem('jadwal', JSON.stringify(jadwal));
        setLogin(true);
        setUser(user);
        setLoading(false);
        setSnackbar(`Hi, ${user.firstName}`);
      } else {
        throw new Error('An error has been occured during the login');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setSnackbar(error.message);
    }
  };

  return (
    <Layout>
      <Image source={BgImage} style={styles.backgroundImage} />
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
          autoCompleteType="email"
          keyboardType="email-address"
        />
        <TextInput
          onChangeText={value => setValue('password')(value)}
          style={styles.inputStyle}
          mode="flat"
          label="Password"
          value={values.password}
          secureTextEntry={true}
          autoCompleteType="password"
          on
        />
        <Button
          contentStyle={{ marginTop: 5 }}
          style={styles.buttonStyle}
          mode="contained"
          loading={loading}
          onPress={userLogin}
          disabled={!buttonDisabled()}
        >
          Login
        </Button>
      </ScrollView>
    </Layout>
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
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    height: '100%'
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
