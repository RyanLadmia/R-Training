import { z } from 'zod';

export const validateRequest = (schema) => {
  return async (c, next) => {
    try {
      const body = await c.req.json();
      const validatedData = schema.parse(body);
      
      // Ajouter les données validées à la requête pour y accéder dans le contrôleur
      c.set('validatedData', validatedData);
      
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({
          error: error.errors[0].message
        }, 400);
      }
      
      return c.json({
        error: 'Erreur de validation des données'
      }, 400);
    }
  };
}; 