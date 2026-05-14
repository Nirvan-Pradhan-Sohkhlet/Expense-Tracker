import API from './api'; 

export const register = (userData) => API.post('/auth/register', userData);

export const login = async (userData) => {
  const response = await API.post('/auth/login', userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};