from rest_framework import generics, status, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q, Sum, Count, Max
from django.utils import timezone
from datetime import datetime, timedelta
from .models import User, Workout, Exercise
from .serializers import (
    UserRegistrationSerializer, UserSerializer, LoginSerializer,
    WorkoutSerializer, WorkoutListSerializer, ExerciseSerializer
)


class UserRegistrationView(generics.CreateAPIView):
    """User registration endpoint"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """User login endpoint"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """User profile endpoint"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class WorkoutListCreateView(generics.ListCreateAPIView):
    """List and create workouts"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return WorkoutListSerializer
        return WorkoutSerializer
    
    def get_queryset(self):
        queryset = Workout.objects.filter(user=self.request.user)
        
        # Filter by date
        date = self.request.query_params.get('date', None)
        if date:
            queryset = queryset.filter(date=date)
        
        # Filter by type
        workout_type = self.request.query_params.get('type', None)
        if workout_type:
            queryset = queryset.filter(type=workout_type)
        
        return queryset


class WorkoutDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a workout"""
    serializer_class = WorkoutSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Workout.objects.filter(user=self.request.user)


class ExerciseListCreateView(generics.ListCreateAPIView):
    """List and create exercises"""
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Exercise.objects.filter(workout__user=self.request.user)
        
        # Filter by workout_id
        workout_id = self.request.query_params.get('workout_id', None)
        if workout_id:
            queryset = queryset.filter(workout_id=workout_id)
        
        return queryset
    
    def perform_create(self, serializer):
        workout_id = self.request.data.get('workout_id')
        try:
            workout = Workout.objects.get(id=workout_id, user=self.request.user)
            serializer.save(workout=workout)
        except Workout.DoesNotExist:
            raise serializers.ValidationError("Workout not found")


class ExerciseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete an exercise"""
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Exercise.objects.filter(workout__user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics"""
    user = request.user
    
    # Recent workouts (last 7 days)
    week_ago = timezone.now().date() - timedelta(days=7)
    recent_workouts = Workout.objects.filter(
        user=user, 
        date__gte=week_ago
    ).order_by('-date')[:5]
    
    # Weekly training volume
    weekly_volume = Workout.objects.filter(
        user=user,
        date__gte=week_ago
    ).aggregate(
        total_duration=Sum('duration'),
        total_workouts=Count('id')
    )
    
    # Personal records (highest weight for each exercise)
    personal_records = Exercise.objects.filter(
        workout__user=user,
        weight__isnull=False
    ).values('name').annotate(
        max_weight=Max('weight')
    ).order_by('-max_weight')[:5]
    
    return Response({
        'recent_workouts': WorkoutListSerializer(recent_workouts, many=True).data,
        'weekly_stats': weekly_volume,
        'personal_records': list(personal_records)
    })
