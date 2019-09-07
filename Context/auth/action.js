import axios from 'axios';
import config from '../../config';
import dispatchAction from '../dispatchAction';
import { AsyncStorage } from 'react-native';

export const actionTypes = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGIN_SUCCESS: 'USER_LOGIN_SUCCESS'
};

export const actionLogin = (dispatch, payload, opt) => {
  const url = config.baseUrl + '/api/auth/login';
  const userLogin = async () => {
    const response = await axios.post(url, payload, { timeout: 30000 });
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
      opt.setLogin(true);
      opt.setUser(user);
      dispatch({
        type: actionTypes.USER_LOGIN_SUCCESS,
        data: user
      });
    } else {
      const message = response.data && response.data.message;
      throw new Error(message || 'An error has been occured during the login');
    }
  };
  dispatchAction(dispatch, actionTypes.USER_LOGIN, userLogin);
};
