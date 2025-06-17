import axios from 'axios';
import AuthController from './AuthController';

const API_BASE_URL = 'https://bat-adelaide-modern-springer.trycloudflare.com/api/v1';

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

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
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return API(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = AuthController.getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }
                console.log('Refreshing token');
                
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
                    headers: { Authorization: `Bearer ${refreshToken}` }
                });
                
                const { accessToken } = response.data;
                AuthController.login({ accessToken, refreshToken });
                
                API.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                processQueue(null, accessToken);
                
                console.log('Token refreshed');

                return API(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                AuthController.logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default API;