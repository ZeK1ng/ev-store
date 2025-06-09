import axios from 'axios';
import AuthController from './AuthController';

const API_BASE_URL = 'https://ec2-18-205-188-59.compute-1.amazonaws.com/api/v1';

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use(
    config => {
        const token = AuthController.getAccessToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => Promise.reject(error)
);

API.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error);
    }
);

export default API;