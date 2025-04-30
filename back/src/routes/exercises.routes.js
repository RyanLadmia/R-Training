import { Hono } from 'hono';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const exercisesRoutes = new Hono();

const EXERCISE_NAMES = [
    'bench press', // Développé couché
    'pull up', // Tractions
    'barbell row', // Rowing barre
    'lateral raise', // Élévations latérales
    'deadlift',
    'romanian deadlift', // Deadlift jambes tendues
    'face pull',
    'military press', // Développé militaire
    'biceps curl' // Curl biceps
];

// Route pour récupérer les exercices
exercisesRoutes.get('/popular', async (c) => {
    try {
        console.log('Récupération des exercices depuis ExerciseDB API...');
        
        const options = {
            method: 'GET',
            url: 'https://exercisedb.p.rapidapi.com/exercises',
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        console.log(`Nombre total d'exercices récupérés: ${response.data.length}`);

        // Filtrer les exercices pour ne garder que ceux qui nous intéressent
        const filteredExercises = response.data.filter(exercise => {
            if (!exercise || !exercise.name) {
                return false;
            }

            return EXERCISE_NAMES.some(name => {
                const exerciseName = exercise.name.toLowerCase();
                const searchName = name.toLowerCase();
                const isMatch = exerciseName.includes(searchName);
                if (isMatch) {
                    console.log(`Match trouvé: ${exercise.name} correspond à ${name}`);
                }
                return isMatch;
            });
        });

        console.log(`Nombre d'exercices correspondants trouvés: ${filteredExercises.length}`);

        // Si nous n'avons pas trouvé nos exercices spécifiques, prenons les premiers exercices disponibles
        const finalExercises = filteredExercises.length > 0 
            ? filteredExercises 
            : response.data.slice(0, 9);

        return c.json({
            count: finalExercises.length,
            results: finalExercises.map(exercise => ({
                id: exercise.id,
                name: exercise.name,
                bodyPart: exercise.bodyPart,
                equipment: exercise.equipment,
                target: exercise.target,
                secondaryMuscles: exercise.secondaryMuscles,
                instructions: exercise.instructions,
                gifUrl: exercise.gifUrl
            }))
        });
    } catch (error) {
        console.error('Erreur ExerciseDB API:', error.response?.data || error.message);
        return c.json(
            {
                error: 'Erreur lors de la récupération des exercices',
                details: error.response?.data || error.message
            },
            error.response?.status || 500
        );
    }
});

export { exercisesRoutes }; 