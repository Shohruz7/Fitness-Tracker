from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, Workout, Exercise


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'created_at')
        read_only_fields = ('id', 'created_at')


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email_or_username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email_or_username = attrs.get('email_or_username')
        password = attrs.get('password')
        
        if email_or_username and password:
            # Try to authenticate with email first, then username
            user = authenticate(username=email_or_username, password=password)
            if not user:
                # If email login failed, try to find user by username and authenticate with email
                try:
                    from .models import User
                    user_obj = User.objects.get(username=email_or_username)
                    user = authenticate(username=user_obj.email, password=password)
                except User.DoesNotExist:
                    pass
            
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email/username and password')
        
        return attrs


class ExerciseSerializer(serializers.ModelSerializer):
    """Serializer for exercises"""
    class Meta:
        model = Exercise
        fields = ('id', 'name', 'sets', 'reps', 'weight', 'duration', 'created_at')
        read_only_fields = ('id', 'created_at')


class WorkoutSerializer(serializers.ModelSerializer):
    """Serializer for workouts"""
    exercises = ExerciseSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Workout
        fields = ('id', 'user', 'date', 'type', 'duration', 'distance', 'notes', 'exercises', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        try:
            return super().create(validated_data)
        except Exception as e:
            if 'UNIQUE constraint failed' in str(e) or 'duplicate key value' in str(e):
                raise serializers.ValidationError({
                    'non_field_errors': ['You already have a workout of this type on this date. Please choose a different date or type.']
                })
            raise e


class WorkoutListSerializer(serializers.ModelSerializer):
    """Simplified serializer for workout lists"""
    exercise_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Workout
        fields = ('id', 'date', 'type', 'duration', 'distance', 'notes', 'exercise_count', 'created_at')
    
    def get_exercise_count(self, obj):
        return obj.exercises.count()
