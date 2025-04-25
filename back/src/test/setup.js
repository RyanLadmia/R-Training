import { vi } from 'vitest';

// Ce fichier est exécuté avant les tests
// Vous pouvez définir ici des mocks globaux, des variables d'environnement, etc.

// Exemple: configurer les variables d'environnement pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

// Nettoyer les mocks après chaque test
afterEach(() => {
  vi.restoreAllMocks();
}); 