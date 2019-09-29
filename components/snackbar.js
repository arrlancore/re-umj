import { Snackbar } from 'react-native-paper';
import { AsyncStorage } from 'react-native';
import { AuthContext } from '../Context';
import React from 'react';
import { string, object } from 'prop-types';
import { withNavigation } from 'react-navigation';
import { usePrevious, SnackbarContext } from '../Context';

function Snackbars({ message, navigation }) {
  const [open, setOpen] = React.useState(false);
  const { setLogin } = React.useContext(AuthContext);
  const [msg, setMsg] = React.useState('');
  const [, setMessage] = React.useContext(SnackbarContext);
  const DURATION = 3000;
  const prevMessage = usePrevious(message);

  const logout = async () => { // eslint-disable-line
    await AsyncStorage.clear();
    setLogin(false);
    navigation.navigate('Login');
  };

  React.useEffect(() => {
    if (message && message !== prevMessage) {
      setMsg(message);
      setOpen(true);
      setTimeout(() => {
        setMsg('');
        setMessage('');
        setOpen(false);
        if (message.search('401') >= 0) {
          logout();
        }
      }, DURATION);
    }
  }, [logout, message, msg, prevMessage, setMessage]);
  return (
    <Snackbar
      visible={open}
      onDismiss={() => setOpen(false)}
      duration={DURATION}
    >
      {msg}
    </Snackbar>
  );
}

Snackbars.propTypes = { message: string, navigation: object };

export default withNavigation(Snackbars);
