import fs from 'fs/promises';
import path from 'path';

// Configuration du stockage
const storageConfig = {
    type: 'local', // 'local' ou 'aws'
    localPath: '../front/src/assets/images/profiles',
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxSize: 5 * 1024 * 1024 // 5MB
};

class StorageService {
    constructor(config = storageConfig) {
        this.config = config;
    }

    async saveProfilePicture(file, userId) {
        switch (this.config.type) {
            case 'local':
                return this.saveLocal(file, userId);
            case 'aws':
                return this.saveAWS(file, userId);
            default:
                throw new Error('Type de stockage non supporté');
        }
    }

    async saveLocal(file, userId) {
        try {
            // Vérifier le type de fichier
            if (!this.config.allowedTypes.includes(file.type)) {
                throw new Error('Type de fichier non autorisé');
            }

            // Vérifier la taille du fichier
            if (file.size > this.config.maxSize) {
                throw new Error('Fichier trop volumineux');
            }

            // Créer le dossier s'il n'existe pas
            await fs.mkdir(this.config.localPath, { recursive: true });

            // Générer le nom du fichier
            const extension = path.extname(file.name);
            const filename = `profile_${userId}${extension}`;
            const filepath = path.join(this.config.localPath, filename);

            // Sauvegarder le fichier
            await fs.writeFile(filepath, file.buffer);

            // Retourner le chemin relatif pour le frontend
            return `/images/profiles/${filename}`;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du fichier:', error);
            throw error;
        }
    }

    async saveAWS(file, userId) {
        // À implémenter plus tard pour AWS
        throw new Error('AWS storage not implemented yet');
    }

    async deleteProfilePicture(userId) {
        switch (this.config.type) {
            case 'local':
                return this.deleteLocal(userId);
            case 'aws':
                return this.deleteAWS(userId);
            default:
                throw new Error('Type de stockage non supporté');
        }
    }

    async deleteLocal(userId) {
        try {
            const directory = this.config.localPath;
            const files = await fs.readdir(directory);
            
            // Trouver et supprimer l'ancienne photo de profil
            const profilePic = files.find(file => file.startsWith(`profile_${userId}`));
            if (profilePic) {
                await fs.unlink(path.join(directory, profilePic));
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du fichier:', error);
            // Ne pas throw l'erreur car la suppression n'est pas critique
        }
    }

    async deleteAWS(userId) {
        // À implémenter plus tard pour AWS
        throw new Error('AWS storage not implemented yet');
    }
}

export default new StorageService(); 