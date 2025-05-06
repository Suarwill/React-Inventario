import axios from 'axios';

// Configuración de axios para incluir el token en todas las solicitudes
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',  // Cambia esto a la URL de tu API
});

// Si el token está disponible, agregarlo a las cabeceras
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
