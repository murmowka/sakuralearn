from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id',
            'user',
            'level',
            'study_streak',
            'words_learned',
            'hours_studied',
            'daily_goal',
            'notifications_enabled',
            'dark_theme',
            'show_tips',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class RegisterSerializer(serializers.Serializer):
    """Сериализатор для регистрации пользователя."""
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(min_length=8, write_only=True)
    password_confirm = serializers.CharField(min_length=8, write_only=True)

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password': 'Пароли не совпадают'})

        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Пользователь с таким email уже существует'})

        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'username': 'Пользователь с таким именем уже существует'})

        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Создаем профиль пользователя
        # UserProfile.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    """Сериализатор для входа пользователя."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserDetailSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id']
