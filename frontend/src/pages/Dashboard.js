import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI, workoutAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Logo from '../components/Logo';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, workoutsResponse] = await Promise.all([
          dashboardAPI.getStats(),
          workoutAPI.getWorkouts({ limit: 5 })
        ]);
        
        setStats(statsResponse.data);
        setRecentWorkouts(workoutsResponse.data.results || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.username || user?.email}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your fitness journey and stay motivated.
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors duration-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🏋️</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total Workouts
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.total_workouts || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors duration-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total Duration
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.total_duration ? `${Math.round(stats.total_duration / 60)}h` : '0h'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors duration-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🏃</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total Distance
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.total_distance ? `${stats.total_distance}km` : '0km'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors duration-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">💪</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Personal Records
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stats.personal_records || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/workouts/new"
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-all duration-200"
          >
            <div className="p-6 text-center">
              <span className="text-4xl mb-4 block">➕</span>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add Workout</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Log a new workout session
              </p>
            </div>
          </Link>

          <Link
            to="/workouts"
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-all duration-200"
          >
            <div className="p-6 text-center">
              <span className="text-4xl mb-4 block">📋</span>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">View Workouts</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Browse your workout history
              </p>
            </div>
          </Link>

          <Link
            to="/charts"
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-all duration-200"
          >
            <div className="p-6 text-center">
              <span className="text-4xl mb-4 block">📊</span>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">View Charts</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Analyze your progress
              </p>
            </div>
          </Link>
        </div>

        {/* Recent Workouts */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-200">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Workouts</h3>
          </div>
          <div className="p-6">
            {recentWorkouts.length > 0 ? (
              <div className="space-y-4">
                {recentWorkouts.map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {workout.type}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(workout.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {workout.duration ? `${workout.duration} min` : 'N/A'}
                      </p>
                      {workout.distance && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {workout.distance} km
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <Logo size="lg" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No workouts yet</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start your fitness journey by adding your first workout!
                </p>
                <Link
                  to="/workouts/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Add Workout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
