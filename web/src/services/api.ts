import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000'
});

// api.interceptors.request.use(config => {
  
//   if (token) config.de.Authorization = `Bearer ${token}`
  
//   return config;
// });
const token = localStorage.getItem('@DOWHILE:TOKEN');

api.defaults.headers.common.authorization = `Bearer ${token}`