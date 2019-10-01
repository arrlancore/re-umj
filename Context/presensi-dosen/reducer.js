// reducers hold the store's state (the initialState object defines it)
// reducers also handle plain object actions and modify
// their state (immutably) accordingly
// this is the only way to change the store's state
// the other exports in this file are selectors, which is business logic
// that digests parts of the store's state
// for easier consumption by views

import { actionTypes } from './action';

/**
 * default set reducer that will be always return data
 * @param {object} state
 * @param {object} action
 * @param {string} actionType
 */
function setDataReducer(state, action, actionType) {
  if (action.type === actionType) {
    return action.data;
  }
  return state;
}

export const listPresensiDosenReducer = (state = null, action) =>
  setDataReducer(state, action, actionTypes.LIST_PRESENSI_DOSEN_SUCCESS);

export const presensiDosenReducer = (state = null, action) =>
  setDataReducer(state, action, actionTypes.PRESENSI_DOSEN_SUCCESS);

export const reportPresensiDosenReducer = (state = null, action) =>
  setDataReducer(state, action, actionTypes.REPORT_PRESENSI_DOSEN_SUCCESS);
