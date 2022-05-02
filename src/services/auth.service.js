import axios from 'axios';
import config from '../config';
import authHeader from './auth.header';

const API_URL = `${config.BE_URI}/api/v1/auth`;

class AuthService {

  async login(user) {
    const response = await axios
          .post(API_URL + '/login', {
              email: user.username,
              password: user.password
          });
      if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
  }

  async profile() {
    const response = await axios.get(API_URL + '/me', { headers: authHeader() });

      if (response.data) {
          localStorage.setItem('user.profile', JSON.stringify(response.data));
      }
      return response.data;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('user.profile');
  }

  register(user) {
    return axios.post(API_URL + '/register', {
      name: user.username,
      email: user.email,
      password: user.password
    });
  }
}
export default new AuthService();