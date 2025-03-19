// Write interceptor
import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // import environment variable file
});

api.interceptors.request.use(
    (config) => {
        // Look into local storage to see if we have access token
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Pass a JWT access token: create auth header (automatically handled by axios)
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
