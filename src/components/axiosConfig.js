import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/', // Asegúrate de que todas las solicitudes usen el prefijo /api/
  timeout: 30000, // Aumentar el tiempo de espera a 30 segundos
  headers: {
    'Accept-Encoding': 'gzip, deflate, br', // Aceptar respuestas comprimidas
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
