import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workoutAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Logo from '../components/Logo';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await workoutAPI.getWorkouts();
        setWorkouts(response.data.results || []);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setError('Failed to load workouts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await workoutAPI.deleteWorkout(id);
        setWorkouts(workouts.filter(workout => workout.id !== id));
      } catch (error) {
        console.error('Error deleting workout:', error);
        alert('Failed to delete workout');
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
            <p className="mt-2 text-gray-600">
              Track and manage your workout sessions
            </p>
          </div>
          <Link
            to="/workouts/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Workout
          </Link>
        </div>

        {/* Workouts List */}
        {workouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <div key={workout.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 capitalize">
                      {workout.type}
                    </h3>
                    <div className="flex space-x-2">
                      <Link
                        to={`/workouts/${workout.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(workout.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{new Date(workout.date).toLocaleDateString()}</span>
                    </div>
                    {workout.duration && (
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{workout.duration} minutes</span>
                      </div>
                    )}
                    {workout.distance && (
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span>{workout.distance} km</span>
                      </div>
                    )}
                  </div>

                  {workout.notes && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {workout.notes}
                      </p>
                    </div>
                  )}

                  <div className="mt-4">
                    <Link
                      to={`/workouts/${workout.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Logo size="xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No workouts yet</h3>
            <p className="text-gray-500 mb-6">
              Start tracking your fitness journey by adding your first workout!
            </p>
            <Link
              to="/workouts/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Your First Workout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutList;
