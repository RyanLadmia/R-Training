'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex justify-center mb-6">
          <ShieldAlert className="text-red-500 h-16 w-16" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès non autorisé</h1>
        
        <p className="text-gray-600 mb-6">
          Vous n'avez pas les droits nécessaires pour accéder à cette page.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Button
            onClick={() => navigate('/')}
            className="w-full"
          >
            Retour à l'accueil
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
          >
            Retour à la page précédente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 