import instance from './config';

// Récupérer tous les utilisateurs
export async function get_all_users() {
    try {
        const response = await instance.get('/admin/users');
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error.response?.data?.error || error.message);
        throw error;
    }
}

// Récupérer un utilisateur par son ID
export async function get_profile_user_by_id(userId) {
    try {
        const response = await instance.get(`/admin/profile/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error.response?.data?.error || error.message);
        throw error;
    }
}

// Mettre à jour le profil de l'admin
export async function update_profile(userId, data) {
    try {
        const response = await instance.put(`/admin/profile/${userId}`, data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error.response?.data?.error || error.message);
        throw error;
    }
}

// Mettre à jour un utilisateur (en tant qu'admin)
export async function update_user(userId, userData) {
    try {
        const response = await instance.put(`/admin/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error.response?.data?.error || error.message);
        throw error;
    }
}

// Supprimer un utilisateur
export async function delete_user(userId) {
    try {
        const response = await instance.delete(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error.response?.data?.error || error.message);
        throw error;
    }
}
