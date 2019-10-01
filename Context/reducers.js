// import { authReducer } from './auth/reducer'
import { errorReducer, loadingReducer } from './default/reducer';
import {
  listPresensiDosenReducer,
  presensiDosenReducer,
  reportPresensiDosenReducer
} from './presensi-dosen/reducer';
import {
  listPresensiMahasiswaReducer,
  presensiMahasiswaReducer,
  reportPresensiMahasiswaReducer
} from './presensi-mahasiswa/reducer';

export const reducers = {
  loading: loadingReducer,
  error: errorReducer,
  listPresensiDosen: listPresensiDosenReducer,
  presensiDosen: presensiDosenReducer,
  listPresensiMahasiswa: listPresensiMahasiswaReducer,
  presensiMahasiswa: presensiMahasiswaReducer,
  reportPresensiDosen: reportPresensiDosenReducer,
  reportPresensiMahasiswa: reportPresensiMahasiswaReducer
};

const combineReducers = reducer => {
  return (state = {}, action) => {
    const keys = Object.keys(reducer);
    const nextReducers = {};
    for (let i = 0; i < keys.length; i++) {
      const invoke = reducer[keys[i]](state[keys[i]], action);
      nextReducers[keys[i]] = invoke;
    }
    return nextReducers;
  };
};

export default combineReducers(reducers);
