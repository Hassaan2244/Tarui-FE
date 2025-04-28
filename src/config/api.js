import axios from "axios";
import { logout } from "../redux/slices/authSlice";
import config from "./vars";


const { baseURL } = config;
let store;

export const injectStore = (_store) => {
    store = _store;
};

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized! Logging out...");
            if (store) {
                store.dispatch(logout());
            }
        }
        return Promise.reject(error);
    }
);

export default api;
