from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),  # Registration endpoint
    path('login/', TokenObtainPairView.as_view(), name='login'),  # Login endpoint
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh token endpoint
    path('logout/', LogoutView.as_view(), name='logout'),  # Logout endpoint
]
