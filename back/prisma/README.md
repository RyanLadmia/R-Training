# Guide d'utilisation de Prisma et Prisma Studio

**1. Base de données configurée**

Installé Prisma et le client Prisma
Initialisé la configuration Prisma
Créé un schéma de base avec un modèle User et une énumération Role
Configuré l'URL de la base de données (PostgreSQL)
Créé un utilitaire pour partager l'instance Prisma dans toute l'application



**2. Générer le client Prisma**
Exécutez cette commande pour générer le client Prisma basé sur votre schéma:
```bash
npx prisma generate
```



**3. Créer les tables dans votre base de données**
Pour créer les tables dans la base de données:
```bash
npx prisma migrate dev --name init
```
Si la base de données n'existe pas encore, créez-la d'abord dans PostgreSQL.



**4. Utiliser Prisma Studio**
Prisma Studio est une interface graphique pour explorer et modifier vos données:
```bash
npx prisma studio
```
Cela ouvrira une interface web, généralement sur http://localhost:5555, où vous pourrez visualiser et modifier vos données.



**5. Utiliser Prisma dans votre code**
Voici comment utiliser Prisma dans vos contrôleurs:
```js
// Exemple avec un contrôleur d'authentification
import prisma from '../utils/prisma.js';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

// Créer un utilisateur
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await hash(password, 10);
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName
      }
    });
    
    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return res.status(201).json({ user: { id: user.id, email: user.email }, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
```


**6. Avantages de Prisma**
Type-safety: Génère automatiquement des types TypeScript
Migrations: Gestion facile des changements de schéma
Studio: Interface visuelle pour gérer les données
Queries intuitives: API claire et bien documentée
Relations: Gestion facile des relations entre tables
Votre projet est maintenant configuré avec Prisma. Pour utiliser Prisma pleinement, assurez-vous d'avoir une base de données PostgreSQL en cours d'exécution avec les identifiants spécifiés dans le fichier .env.
