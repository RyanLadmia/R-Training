import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    headers: { 'Content-Type': "application/json"},
    withCredentials: true // Permet de transmettre les cookies avec les requêtes
});

// Intercepteur pour les requêtes
instance.interceptors.request.use(
    async (config) => {
      // Pas besoin de récupérer le token manuellement 
      // car withCredentials: true enverra automatiquement les cookies
      return config;
    },
    (error) => {
      console.error("Erreur lors de la requête:", error);
      return Promise.reject(error);
    }
);

// Intercepteur pour les réponses
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Ne pas logger les erreurs 401 (non authentifié)
        if (error.response && error.response.status === 401) {
            return Promise.reject(error);
        }
        
        // Logger les autres erreurs
        console.error("Erreur de réponse:", error);
        return Promise.reject(error);
    }
);

export default instance