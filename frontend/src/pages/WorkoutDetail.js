import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { workoutAPI, exerciseAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const [workoutResponse, exercisesResponse] = await Promise.all([
          workoutAPI.getWorkout(id),
          exerciseAPI.getExercises({ workout: id })
        ]);
        
        setWorkout(workoutResponse.data);
        setExercises(exercisesResponse.data.results || []);
      } catch (error) {
        console.error('Error fetching workout data:', error);
        setError('Failed to load workout');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkoutData();
  }, [id]);

  const handleDeleteWorkout = async () => {
    if (window.confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
      try {
        await workoutAPI.deleteWorkout(id);
        navigate('/workouts');
      } catch (error) {
        console.error('Error deleting workout:', error);
        alert('Failed to delete workout');
      }
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        await exerciseAPI.deleteExercise(exerciseId);
        setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
      } catch (error) {
        console.error('Error deleting exercise:', error);
        alert('Failed to delete exercise');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Workout not found'}</p>
          <Link
            to="/workouts"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Workouts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {workout.type} Workout
              </h1>
              <p className="mt-2 text-gray-600">
                {new Date(workout.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/workouts/${id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Edit Workout
              </Link>
              <button
                onClick={handleDeleteWorkout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Delete Workout
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workout Details */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Workout Details</h3>
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{workout.type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(workout.date).toLocaleDateString()}
                  </dd>
                </div>
                {workout.duration && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Duration</dt>
                    <dd className="mt-1 text-sm text-gray-900">{workout.duration} minutes</dd>
                  </div>
                )}
                {workout.distance && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Distance</dt>
                    <dd className="mt-1 text-sm text-gray-900">{workout.distance} km</dd>
                  </div>
                )}
                {workout.notes && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {workout.notes}
                    </dd>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Exercises</h3>
                <Link
                  to={`/workouts/${id}/exercises/new`}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Add Exercise
                </Link>
              </div>
              <div className="p-6">
                {exercises.length > 0 ? (
                  <div className="space-y-4">
                    {exercises.map((exercise) => (
                      <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">
                              {exercise.name}
                            </h4>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              {exercise.sets && (
                                <div>
                                  <span className="font-medium">Sets:</span> {exercise.sets}
                                </div>
                              )}
                              {exercise.reps && (
                                <div>
                                  <span className="font-medium">Reps:</span> {exercise.reps}
                                </div>
                              )}
                              {exercise.weight && (
                                <div>
                                  <span className="font-medium">Weight:</span> {exercise.weight} kg
                                </div>
                              )}
                              {exercise.duration && (
                                <div>
                                  <span className="font-medium">Duration:</span> {exercise.duration} min
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Link
                              to={`/exercises/${exercise.id}/edit`}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteExercise(exercise.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">💪</span>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No exercises yet</h4>
                    <p className="text-gray-500 mb-4">
                      Add exercises to track your workout details
                    </p>
                    <Link
                      to={`/workouts/${id}/exercises/new`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Add Exercise
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;
