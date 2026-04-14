from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, UserProfileViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'profile', UserProfileViewSet, basename='profile')

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', include(router.urls)),  # ВОТ ЭТОГО НЕ ХВАТАЕТ

    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
]