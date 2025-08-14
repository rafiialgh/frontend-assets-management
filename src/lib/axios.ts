import axios from 'axios'
import { getSession, SESSION_KEY } from './utils';
import secureLocalStorage from 'react-secure-storage';

const baseUrl = import.meta.env.VITE_API_URL ?? ''

export const globalInstance = axios.create({
  baseURL: baseUrl,
});

export const privateInstance = axios.create({
  baseURL: baseUrl,
});

privateInstance.interceptors.request.use((config) => {
  const session = getSession();

  config.headers.Authorization = `Bearer ${session?.token}`;
  
  return config;
});

privateInstance.interceptors.response.use((response) => response, async (error) => {
  if (
    error.response?.status === 401 && error.response?.data?.message === 'Please login again!'
  ) {
    secureLocalStorage.removeItem(SESSION_KEY)

    window.location.href = '/login'
  }

  return Promise.reject(error)
})