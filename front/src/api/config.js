import axios from "axios";

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    timeout: 5000,
    headers: { 'Content-Type': "application/json"}
});

instance.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem('accessToken');
  
      if (token !== null) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      console.log("une erreur est survenue:", error);
      return Promise.reject(new Error(error));
    }
  );
  
  
export default instance