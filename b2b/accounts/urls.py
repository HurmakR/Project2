from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, LogoutView, UserInfoView, AdminView, DealerView, EndUserView, ResetPasswordView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),           # User registration
    path('login/', TokenObtainPairView.as_view(), name='login'),          # User login (JWT token generation)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Token refresh
    path('logout/', LogoutView.as_view(), name='logout'),                 # User logout
    path('user-info/', UserInfoView.as_view(), name='user_info'),         # User information

    # Role-specific views
    path('admin-view/', AdminView.as_view(), name='admin_view'),          # Accessible to admins
    path('dealer-view/', DealerView.as_view(), name='dealer_view'),       # Accessible to dealers
    path('end-user-view/', EndUserView.as_view(), name='end_user_view'),  # Accessible to end users
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
]
