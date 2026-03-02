import axios from 'axios';
import { BASE_URL } from './apipath';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Important if using cookies
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the token from localStorage if you decide to use tokens instead of cookies
// For now, if the backend uses cookie-parser, withCredentials: true might be enough if cookies are set properly.
// But usually MERN stack with JWT often uses Authorization header as well.
// Let's check backend auth middleware if possible, or support both.
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            // window.location.href = '/login'; 
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
