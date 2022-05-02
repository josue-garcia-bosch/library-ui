import axios from 'axios';
import authHeader from './auth.header';
import config from '../config';

const API_URL = `${config.BE_URI}/api/v1`;

class UserService {
    getUsers(order, limit, page) {
        console.log(order, limit, page);
        return axios.get(API_URL + '/users', { params: { order: order, limit: limit, page: page }, headers: authHeader() });
    }
    getUserById(userId) {
        return axios.get(API_URL + `/users/${userId}`, { headers: authHeader() });
    }
    deleteUserById(userId) {
        return axios.delete(API_URL + `/users/${userId}`, { headers: authHeader() });
    }
    createUser(user) {
        return axios.post(API_URL + '/users', {
            name: user.username,
            email: user.email,
            password: user.password,
            role: user.role
        }, { headers: authHeader() });
    }
    promoteUser(userId, role) {
        return axios.patch(API_URL + `/users/${userId}/promote`, {
            role: role
        }, { headers: authHeader() });
    }

}
export default new UserService();