import Api from '../../helper/api';
import getUser from '../../helper/user';
import dispatchAction from '../dispatchAction';

// action type strings should be unique
// across reducers so namespace them with the reducer name
export const actionTypes = {
  PRESENSI_DOSEN: 'PRESENSI_DOSEN',
  PRESENSI_DOSEN_SUCCESS: 'PRESENSI_DOSEN_SUCCESS',
  LIST_PRESENSI_DOSEN: 'LIST_PRESENSI_DOSEN',
  LIST_PRESENSI_DOSEN_SUCCESS: 'LIST_PRESENSI_DOSEN_SUCCESS'
};

// actions are where most of the business logic takes place
// they are dispatched by views or by other actions

/**
 *
 * @param {function} dispatch
 * @param {object} payload
 * *** PRESENSI_DOSEN ***
 */

const moduleRoutes = '/api/presensi-dosen';

export const list = (dispatch, params) => async setNotif => {
  const user = await getUser();

  const action = async () => {
    const response = await Api.get(moduleRoutes, {
      params,
      headers: { Authorization: user.token }
    });
    if (response.status <= 204) {
      let data = response.data;
      dispatch({
        type: actionTypes.LIST_PRESENSI_DOSEN_SUCCESS,
        data
      });
    } else {
      const message = response.data && response.data.message;
      throw new Error(message || 'An error has been occured');
    }
  };
  dispatchAction(dispatch, actionTypes.LIST_PRESENSI_DOSEN, action, setNotif);
};

export const view = (dispatch, params) => async setNotif => {
  const user = await getUser();
  const path = moduleRoutes + '/view';
  const action = async () => {
    const response = await Api.get(path, {
      params,
      headers: { Authorization: user.token }
    });
    if (response.status <= 204) {
      let data = response.data;
      dispatch({
        type: actionTypes.PRESENSI_DOSEN_SUCCESS,
        data
      });
    } else {
      const message = response.data && response.data.message;
      throw new Error(message || 'An error has been occured');
    }
  };
  dispatchAction(dispatch, actionTypes.PRESENSI_DOSEN, action, setNotif);
};

export const create = (dispatch, payload) => async setNotif => {
  const user = await getUser();
  const action = async () => {
    const response = await Api.post(moduleRoutes, payload, {
      headers: { Authorization: user.token }
    });
    if (response.status <= 204) {
      let data = response.data;
      dispatch({
        type: actionTypes.PRESENSI_DOSEN_SUCCESS,
        data
      });
    } else {
      const message = response.data && response.data.message;
      throw new Error(message || 'An error has been occured');
    }
  };
  dispatchAction(dispatch, actionTypes.PRESENSI_DOSEN, action, setNotif);
};

export const update = (dispatch, payload, params) => async setNotif => {
  const user = await getUser();
  const path = moduleRoutes + '/edit';
  const action = async () => {
    const response = await Api.put(path, payload, {
      params,
      headers: { Authorization: user.token }
    });
    if (response.status <= 204) {
      let data = response.data;
      dispatch({
        type: actionTypes.PRESENSI_DOSEN_SUCCESS,
        data
      });
    } else {
      const message = response.data && response.data.message;
      throw new Error(message || 'An error has been occured');
    }
  };
  dispatchAction(dispatch, actionTypes.PRESENSI_DOSEN, action, setNotif);
};

export const remove = (dispatch, params) => async setNotif => {
  const user = await getUser();
  const path = moduleRoutes + '/remove';
  const action = async () => {
    const response = await Api.delete(path, {
      params,
      headers: { Authorization: user.token }
    });
    if (response.status <= 204) {
      let data = response.data;
      dispatch({
        type: actionTypes.PRESENSI_DOSEN_SUCCESS,
        data
      });
    } else {
      const message = response.data && response.data.message;
      throw new Error(message || 'An error has been occured');
    }
  };
  dispatchAction(dispatch, actionTypes.PRESENSI_DOSEN, action, setNotif);
};
