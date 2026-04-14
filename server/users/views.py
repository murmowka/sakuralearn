from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import logout
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserDetailSerializer,
    UserProfileSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken

class AuthViewSet(viewsets.ViewSet):
    """ViewSet для управления аутентификацией."""
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # ГЕНЕРИРУЕМ ТОКЕНЫ ДЛЯ НОВОГО ПОЛЬЗОВАТЕЛЯ
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    'message': 'Регистрация успешна',
                    'user': UserDetailSerializer(user).data,
                    'access': str(refresh.access_token),  # <--- ПЕРЕДАЕМ ACCESS ТОКЕН
                    'refresh': str(refresh),  # <--- ПЕРЕДАЕМ REFRESH ТОКЕН
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """Выход пользователя."""
        logout(request)
        return Response(
            {'message': 'Вы вышли из аккаунта'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Получение информации о текущем пользователе."""
        return Response(
            UserDetailSerializer(request.user).data,
            status=status.HTTP_200_OK
        )


class UserProfileViewSet(viewsets.ViewSet):
    """ViewSet для управления профилем пользователя."""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def get_profile(self, request):
        """Получение профиля текущего пользователя."""
        try:
            profile = request.user.profile
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(user=request.user)
        
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['patch'])
    def update_profile(self, request):
        """Обновление профиля текущего пользователя."""
        try:
            profile = request.user.profile
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(user=request.user)
        
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['patch'])
    def update_user_info(self, request):
        user = request.user
        # Обновляем ник (first_name)
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        # Email мы на фронтенде заблокировали, но на бэкенде оставим для надежности
        user.save()
        return Response(UserDetailSerializer(user).data)

