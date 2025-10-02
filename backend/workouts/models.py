from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    """Custom User model extending Django's AbstractUser"""
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email


class Workout(models.Model):
    """Workout model to track user workouts"""
    WORKOUT_TYPES = [
        ('cardio', 'Cardio'),
        ('strength', 'Strength Training'),
        ('flexibility', 'Flexibility'),
        ('sports', 'Sports'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workouts')
    date = models.DateField()
    type = models.CharField(max_length=20, choices=WORKOUT_TYPES)
    duration = models.PositiveIntegerField(null=True, blank=True, help_text="Duration in minutes")
    distance = models.FloatField(null=True, blank=True, help_text="Distance in km/miles")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-date', '-created_at']
        unique_together = ['user', 'date', 'type']
    
    def __str__(self):
        return f"{self.user.username} - {self.type} on {self.date}"


class Exercise(models.Model):
    """Exercise model to track individual exercises within workouts"""
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='exercises')
    name = models.CharField(max_length=100)
    sets = models.PositiveIntegerField(null=True, blank=True)
    reps = models.PositiveIntegerField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True, help_text="Weight in kg/lbs")
    duration = models.PositiveIntegerField(null=True, blank=True, help_text="Duration in minutes")
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.name} in {self.workout}"
