from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('users/register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('users/login/', views.login_view, name='user-login'),
    path('users/profile/', views.UserProfileView.as_view(), name='user-profile'),
    
    # Workout endpoints
    path('workouts/', views.WorkoutListCreateView.as_view(), name='workout-list-create'),
    path('workouts/<int:pk>/', views.WorkoutDetailView.as_view(), name='workout-detail'),
    
    # Exercise endpoints
    path('exercises/', views.ExerciseListCreateView.as_view(), name='exercise-list-create'),
    path('exercises/<int:pk>/', views.ExerciseDetailView.as_view(), name='exercise-detail'),
    
    # Dashboard endpoint
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
]
