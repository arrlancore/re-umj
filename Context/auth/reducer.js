import { actionTypes } from './action';
import getUser from 'utils/userData';

const initState = { data: getUser() || null };

export const userReducer = (state = initState, action) => {
  if (action.type === actionTypes.USER_LOGIN_SUCCESS) {
    return {
      data: action.data
    };
  }
  return state;
};
