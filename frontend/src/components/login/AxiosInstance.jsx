import axios from 'axios';
import Swal from 'sweetalert2';

const apiUrl = import.meta.env.VITE_API_URL;

const AxiosInstance = axios.create({
    baseURL: `${apiUrl}api`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

AxiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log('Request URL:', config.url);
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

AxiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.log('Response Error:', error.response);
        if (error.response.status === 401) {
            Swal.fire({
                icon: 'error',
                title: 'Session หมดอายุ',
                text: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
            }).then(() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
            });
        }
        return Promise.reject(error);
    }
);

export default AxiosInstance;
