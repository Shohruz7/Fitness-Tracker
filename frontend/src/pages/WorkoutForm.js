import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workoutAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const WorkoutForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    type: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    distance: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditing);

  const workoutTypes = [
    'cardio',
    'strength',
    'flexibility',
    'sports',
    'other'
  ];

  useEffect(() => {
    if (isEditing) {
      const fetchWorkout = async () => {
        try {
          const response = await workoutAPI.getWorkout(id);
          const workout = response.data;
          setFormData({
            type: workout.type || '',
            date: workout.date || new Date().toISOString().split('T')[0],
            duration: workout.duration || '',
            distance: workout.distance || '',
            notes: workout.notes || '',
          });
        } catch (error) {
          console.error('Error fetching workout:', error);
          alert('Failed to load workout');
          navigate('/workouts');
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchWorkout();
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const workoutData = {
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : null,
        distance: formData.distance ? parseFloat(formData.distance) : null,
      };

      if (isEditing) {
        await workoutAPI.updateWorkout(id, workoutData);
      } else {
        await workoutAPI.createWorkout(workoutData);
      }

      navigate('/workouts');
    } catch (error) {
      console.error('Error saving workout:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData && typeof errorData === 'object') {
          // Handle validation errors
          const errorMessages = Object.values(errorData).flat();
          alert(`Validation Error: ${errorMessages.join(', ')}`);
        } else {
          alert('Invalid workout data. Please check your inputs.');
        }
      } else if (error.response?.status === 409) {
        alert('You already have a workout of this type on this date. Please choose a different date or type.');
      } else {
        alert('Failed to save workout. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Workout' : 'Add New Workout'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditing ? 'Update your workout details' : 'Log a new workout session'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Workout Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Workout Type *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select workout type</option>
                {workoutTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Duration and Distance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="0"
                  value={formData.duration}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., 45"
                />
              </div>

              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
                  Distance (km)
                </label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  min="0"
                  step="0.1"
                  value={formData.distance}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., 5.2"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Add any notes about your workout..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/workouts')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  isEditing ? 'Update Workout' : 'Save Workout'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkoutForm;
