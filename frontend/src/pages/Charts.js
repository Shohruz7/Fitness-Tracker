import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { workoutAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Logo from '../components/Logo';

const Charts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await workoutAPI.getWorkouts({ limit: 100 });
        setWorkouts(response.data.results || []);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setError('Failed to load workout data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Process data for charts
  const processChartData = () => {
    if (!workouts.length) return [];

    // Group workouts by date
    const workoutsByDate = workouts.reduce((acc, workout) => {
      const date = new Date(workout.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          date,
          duration: 0,
          distance: 0,
          count: 0,
        };
      }
      acc[date].duration += workout.duration || 0;
      acc[date].distance += workout.distance || 0;
      acc[date].count += 1;
      return acc;
    }, {});

    return Object.values(workoutsByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Get workout type distribution
  const getWorkoutTypeData = () => {
    if (!workouts.length) return [];

    const typeCount = workouts.reduce((acc, workout) => {
      acc[workout.type] = (acc[workout.type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(typeCount).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
    }));
  };

  const chartData = processChartData();
  const workoutTypeData = getWorkoutTypeData();

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Fitness Analytics</h1>
          <p className="mt-2 text-gray-600">
            Track your progress and analyze your workout patterns
          </p>
        </div>

        {workouts.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Logo size="xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No data to display</h3>
            <p className="text-gray-500 mb-6">
              Start logging workouts to see your progress charts!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Workout Duration Over Time */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Workout Duration Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="duration" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Duration (min)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Workout Count Over Time */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Workout Frequency</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#10b981" name="Workouts" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Workout Type Distribution */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Workout Type Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workoutTypeData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8b5cf6" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distance Over Time (if applicable) */}
            {chartData.some(item => item.distance > 0) && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Distance Over Time</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="distance" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        name="Distance (km)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Workouts
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {workouts.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Duration
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {Math.round(workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0) / 60)}h
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🏃</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Distance
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {workouts.reduce((sum, workout) => sum + (workout.distance || 0), 0).toFixed(1)}km
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;
