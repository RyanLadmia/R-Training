/*General exercise list page*/
'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3003';

const ExercisesList = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        console.log('Tentative de connexion à l\'API...');
        const response = await axios.get(`${API_BASE_URL}/api/exercises/popular`);

        console.log('Réponse reçue:', response.status);
        
        if (!response.data || !response.data.results) {
          throw new Error('Format de réponse invalide');
        }

        setExercises(response.data.results);
        setLoading(false);
      } catch (err) {
        console.error('Erreur détaillée:', err);
        
        let messageErreur = 'Une erreur est survenue lors de la récupération des exercices.';
        
        if (err.response) {
          messageErreur = `Erreur ${err.response.status}: ${err.response.data?.error || 'Erreur serveur'}`;
        } else if (err.request) {
          messageErreur = 'Impossible de se connecter au serveur. Vérifiez que le serveur backend est en cours d\'exécution sur le port 3003.';
        } else if (err.message) {
          messageErreur = err.message;
        }

        setError(messageErreur);
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <div className="text-gray-600 text-sm">
          Assurez-vous que :
          <ul className="list-disc mt-2 ml-4">
            <li>Le serveur backend est en cours d'exécution sur le port 3003</li>
            <li>La variable RAPID_API_KEY est correctement définie dans le fichier .env du backend</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Exercices de Musculation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exercises.map((exercise) => (
          <div 
            key={exercise.id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-64 bg-gray-100">
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 capitalize">{exercise.name}</h2>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600">Muscle principal :</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm inline-block mt-1">
                    {exercise.target}
                  </span>
                </div>

                {exercise.secondaryMuscles?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">Muscles secondaires :</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {exercise.secondaryMuscles.map((muscle, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-gray-600">Équipement :</h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm inline-block mt-1">
                    {exercise.equipment}
                  </span>
                </div>

                {exercise.instructions && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Instructions :</h3>
                    <div className="text-sm text-gray-600 space-y-2">
                      {exercise.instructions.map((instruction, index) => (
                        <p key={index} className="flex items-start">
                          <span className="font-medium mr-2">{index + 1}.</span>
                          <span>{instruction}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisesList;
