import axios from 'axios';
import config from '../config';

const baseUrl = config.baseUrl;

const api = {
  get: (path, config) => axios.get(baseUrl + path, config),
  post: (path, data, config) => axios.post(baseUrl + path, data, config),
  put: (path, data, config) => axios.put(baseUrl + path, data, config),
  delete: (path, config) => axios.delete(baseUrl + path, config)
};

export default api;
