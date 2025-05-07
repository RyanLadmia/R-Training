import instance from './config';

// Récupérer le profil d'un administrateur par son ID
export async function get_profile_user_by_id(userId) {
  try {
    const response = await instance.get(`/admin/profile/${userId}`);
    console.log("Réponse du profil admin:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error.response?.data || error.message);
    throw error;
  }
}

// Mettre à jour le profil utilisateur
export async function update_profile(userId, data) {
  try {
    const response = await instance.put(`/auth/user/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error.response?.data || error.message);
    throw error;
  }
}

// Récupérer la liste des utilisateurs (pour admin seulement)
export async function get_all_users() {
  try {
    const response = await instance.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error.response?.data || error.message);
    throw error;
  }
}
