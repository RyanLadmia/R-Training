import axios from 'axios';
import instance from './config';

async function signIn(data) {
    try {
        const response = await instance.post('/auth/login', data);
        if (response.status !== 200 || !response.data.token) {
            throw new Error('Failed to sign in');
        }
        console.log("Response from sign in:", response);
        return response.data;
    } catch (error) {
        console.error("Error during sign in:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function signUp(data) {
    try {
        console.log("Data to be inserted:", data);
        const response = await instance.post("/auth/register", data);
        console.log("Response from database insert:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error during sign up:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function updateProfile(userId, data) {
    try {
        const response = await instance.put(`/auth/users/${userId}`, data);
        if (!response.data) {
            throw new Error('Erreur lors de la mise à jour du profil');
        }
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error.response?.data || error.message);
        throw error;
    }
}