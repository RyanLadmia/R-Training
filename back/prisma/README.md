# Guide d'utilisation de Prisma et Prisma Studio

## Configuration initiale

**1. Installation et configuration de base**

- Installer Prisma et le client Prisma :  


```bash
npm install prisma --save-dev
npm install @prisma/client
```  

- Initialiser la configuration Prisma :  
```bash
npx prisma init
```  

- Créer un schéma avec les modèles nécessaires (User, Role, etc.)  
- Configurer l'URL de la base de données dans le fichier `.env` :  

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/r_training"
```  

- Créer un utilitaire pour partager l'instance Prisma dans toute l'application
  
  

## Configuration de la base de données

**2. Vérifier ou créer le fichier d'environnement**

- S'assurer que le fichier `.env` existe dans le dossier racine du projet
- Vérifier qu'il contient bien la variable `DATABASE_URL` correcte:  

  ```
  DATABASE_URL="postgresql://postgres:password@localhost:5432/nom_de_la_databse"
  ```  

- Si le fichier `.env` est incomplet, vous pouvez le créer à partir du modèle :  

  ```bash
  cp env-new.txt .env
  ```

**3. Générer le client Prisma**

Exécutez cette commande pour générer le client Prisma basé sur votre schéma :  

```bash
npx prisma generate
```  


**4. Création de la base de données**

Il existe deux méthodes pour créer les tables dans la base de données :
  

**Méthode 1 : En utilisant les migrations (recommandé pour le développement)**
```bash
npx prisma migrate dev --name init
```
Cette commande va :
- Créer la base de données si elle n'existe pas
- Créer les tables selon votre schéma
- Générer un historique des migrations
  

**Méthode 2 : En utilisant db push (pour les prototypes ou déploiements simples)**  

```bash
npx prisma db push
```  

Cette commande va :  

- Créer la base de données si elle n'existe pas
- Synchroniser directement le schéma avec la base de données
- Ne pas créer d'historique de migration

Si vous rencontrez l'erreur `Database does not exist`, c'est que la base de données n'a pas encore été créée. La commande `db push` créera automatiquement la base de données pour vous.
  


## Utilisation

**5. Utiliser Prisma Studio**

Prisma Studio est une interface graphique pour explorer et modifier vos données :  

```bash
npx prisma studio
```  

Cela ouvrira une interface web sur http://localhost:5555 (ou http://localhost:5556), où vous pourrez visualiser et modifier vos données.

Si vous rencontrez des erreurs de connexion dans Prisma Studio, vérifiez :
- Que PostgreSQL est bien démarré dans Laragon
- Que le fichier `.env` contient la bonne configuration
- Que la base de données a bien été créée
  

**6. Utiliser Prisma dans votre code**

Voici comment utiliser Prisma dans vos contrôleurs :
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
  


## Résolution des problèmes courants

**7. La base de données n'existe pas**

Si vous recevez l'erreur `Database does not exist on the database server`, exécutez :  

```bash
npx prisma db push
```  

Cette commande créera automatiquement la base de données et synchronisera votre schéma.
  

**8. Problèmes de connexion à PostgreSQL**

- Vérifiez que PostgreSQL est démarré dans Laragon
- Vérifiez les identifiants dans la variable `DATABASE_URL` du fichier `.env`
- Assurez-vous que le port 5432 est disponible et que PostgreSQL écoute sur ce port
  

**9. Avantages de Prisma**

- Type-safety : Génère automatiquement des types TypeScript
- Migrations : Gestion facile des changements de schéma
- Studio : Interface visuelle pour gérer les données
- Queries intuitives : API claire et bien documentée
- Relations : Gestion facile des relations entre tables
  

Votre projet est maintenant configuré avec Prisma. Pour utiliser Prisma pleinement, assurez-vous d'avoir une base de données PostgreSQL en cours d'exécution avec les identifiants spécifiés dans le fichier .env.  
  

**Termes techniques :** 
  
@id = clé primaire
@default(autoincrement()) = AUTO_INCREMENT
String = type + NOT NULL
String? = chaîne de caractère possiblement nulle  

```
email String @unique
```
@unique = UNIQUE


```
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
```
@relation = défini une relation entre deux tables
  - fiels: [userId] = spécifie le champs de la table actuelle qui fait      réference à une autre table
  - references: [id] = spécifie le champs de la table réferencée auquel le champs uqerId fait référence
  - onDelete: Cascade = définit l'action à effectuer si la ligne de la table référencée (ici, User) est supprimée. Dans ce cas, l'option Cascade signifie que la suppression de l'utilisateur entraînera la suppression des lignes associées dans la table actuelle
```
role Role @relation(fields: [roleId], references: [id])
```
   Il s'agit de la relation entre deux modèles : 
    - fields: [roleId] indique quel champ dans le modèle actuel (UserRole) est lié à la table cible (Role)
    - references: [id] spécifie que le champ roleId de UserRole se réfère au champ id dans le modèle Role  



@@unique([userId, roleId]) :

 Cette contrainte unique est appliquée sur une combinaison de champs. Elle garantit que chaque paire de userId et roleId dans la table est unique. Autrement dit, un utilisateur ne peut pas avoir deux rôles identiques dans la table UserRole. Cela empêche des doublons pour les relations entre utilisateurs et rôles.

 DateTime @default(now()) = DateTime/TimeStamp

 Boolean @default(false)
  
price Decimal
  - Decimal est utilisé pour les valeurs numériques avec des décimales, comme les prix ou les taux d'intérêt. Il est plus précis que le type Float, ce qui le rend particulièrement utile pour les applications financières.  

roles UserRole[]  
  - [] (Tableau de relations) : Ce tableau indique qu'il s'agit d'une relation un-à-plusieurs (1:N). Par exemple, un utilisateur peut avoir plusieurs rôles, donc la relation entre User et UserRole est représentée par un tableau d'objets UserRole[]. Cela signifie que chaque utilisateur peut avoir plusieurs lignes dans la table UserRole


  ```
  stock Int @default(0)
  ```
  Valeur par defaut attribuée à "en stock"


  ```
  cartItems CartItem[] @relation(onDelete: Cascade)
  ```  
  - onDelete: Cascade : L'option Cascade pour la relation signifie que si un élément de la table référencée est supprimé (par exemple, un utilisateur), toutes les lignes associées dans la table actuelle (ici CartItem) seront également supprimées automatiquement. Cela garantit que les données liées sont supprimées de manière cohérente pour maintenir l'intégrité des données.


