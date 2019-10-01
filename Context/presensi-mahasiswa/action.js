import Api from '../../helper/api';
import getUser from '../../helper/user';
import dispatchAction from '../dispatchAction';

// action type strings should be unique across reducers'
// so namespace them with the reducer name
export const actionTypes = {
  PRESENSI_MAHASISWA: 'PRESENSI_MAHASISWA',
  PRESENSI_MAHASISWA_SUCCESS: 'PRESENSI_MAHASISWA_SUCCESS',
  LIST_PRESENSI_MAHASISWA: 'LIST_PRESENSI_MAHASISWA',
  LIST_PRESENSI_MAHASISWA_SUCCESS: 'LIST_PRESENSI_MAHASISWA_SUCCESS',
  REPORT_PRESENSI_MAHASISWA: 'REPORT_PRESENSI_MAHASISWA',
  REPORT_PRESENSI_MAHASISWA_SUCCESS: 'REPORT_PRESENSI_MAHASISWA_SUCCESS'
};

// actions are where most of the business logic takes place
// they are dispatched by views or by other actions

/**
 *
 * @param {function} dispatch
 * @param {object} payload
 * *** PRESENSI_MAHASISWA ***
 */

const moduleRoutes = '/api/presensi-mahasiswa';

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
        type: actionTypes.LIST_PRESENSI_MAHASISWA_SUCCESS,
        data
      });
    } else {
      const message = response.data && response.data.message;
      throw new Error(message || 'An error has been occured');
    }
  };
  dispatchAction(
    dispatch,
    actionTypes.LIST_PRESENSI_MAHASISWA,
    action,
    setNotif
  );
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
        type: actionTypes.PRESENSI_MAHASISWA_SUCCESS,
        data
      });
    } else {
      const message = response.data && response.data.message;
      throw new Error(message || 'An error has been occured');
    }
  };
  dispatchAction(dispatch, actionTypes.PRESENSI_MAHASISWA, action, setNotif);
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
        type: actionTypes.PRESENSI_MAHASISWA_SUCCESS,
        data
      });
    } else {
      const message = response.data && response.data.message;
      throw new Error(message || 'An error has been occured');
    }
  };
  dispatchAction(dispatch, actionTypes.PRESENSI_MAHASISWA, action, setNotif);
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
        type: actionTypes.PRESENSI_MAHASISWA_SUCCESS,
        data
      });
    } else {
      const message = response.data && response.data.message;
      throw new Error(message || 'An error has been occured');
    }
  };
  dispatchAction(dispatch, actionTypes.PRESENSI_MAHASISWA, action, setNotif);
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
        type: actionTypes.PRESENSI_MAHASISWA_SUCCESS,
        data
      });
    } else {
      const message = response.data && response.data.message;
      throw new Error(message || 'An error has been occured');
    }
  };
  dispatchAction(dispatch, actionTypes.PRESENSI_MAHASISWA, action, setNotif);
};

export const ambilPresensi = (dispatch, payload, params) => async setNotif => {
  const user = await getUser();
  const path = moduleRoutes + '/ambil';
  const action = async () => {
    const response = await Api.put(path, payload, {
      params,
      headers: { Authorization: user.token }
    });
    if (response.status <= 204) {
      let data = response.data;
      dispatch({
        type: actionTypes.PRESENSI_MAHASISWA_SUCCESS,
        data
      });
    } else {
      const message = response.data && response.data.message;
      throw new Error(message || 'An error has been occured');
    }
  };
  dispatchAction(dispatch, actionTypes.PRESENSI_MAHASISWA, action, setNotif);
};

export const viewByParam = (dispatch, params) => async setNotif => {
  const path = moduleRoutes + '/view-by-param';
  const user = await getUser();
  const action = async () => {
    const response = await Api.get(path, {
      params,
      headers: { Authorization: user.token }
    });
    if (response.status <= 204) {
      let data = response.data;
      dispatch({
        type: actionTypes.PRESENSI_MAHASISWA_SUCCESS,
        data
      });
    } else {
      const message = response.data && response.data.message;
      throw new Error(message || 'An error has been occured');
    }
  };
  dispatchAction(dispatch, actionTypes.PRESENSI_MAHASISWA, action, setNotif);
};

export const getReport = (dispatch, params) => async setNotif => {
  const user = await getUser();
  const path = moduleRoutes + '/report';
  const action = async () => {
    const response = await Api.get(path, {
      params,
      headers: { Authorization: user.token }
    });
    if (response.status <= 204) {
      let data = response.data;
      dispatch({
        type: actionTypes.REPORT_PRESENSI_MAHASISWA_SUCCESS,
        data
      });
    } else {
      const message = response.data && response.data.message;
      throw new Error(message || 'An error has been occured');
    }
  };
  dispatchAction(
    dispatch,
    actionTypes.REPORT_PRESENSI_MAHASISWA,
    action,
    setNotif
  );
};
