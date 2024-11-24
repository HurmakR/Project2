from os import environ

from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import RegisterSerializer, UserSerializer
from .permissions import IsAdminUser, IsStaffOrAdmin, IsDealer, IsEndUser
from django.core.mail import send_mail
import logging

logger = logging.getLogger('email')

class RegisterView(APIView):
    """
    Handles user registration.
    """

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    Handles user logout by blacklisting the refresh token.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserInfoView(APIView):
    """
    Returns the authenticated user's information.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
            "role": user.role,
        })


class AdminView(APIView):
    """
    Endpoint accessible only by admin users.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        return Response({"message": "Welcome, Admin!"})


class DealerView(APIView):
    """
    Endpoint accessible only by dealer users.
    """
    permission_classes = [IsAuthenticated, IsDealer]

    def get(self, request):
        return Response({"message": "Welcome, Dealer!"})


class EndUserView(APIView):
    """
    Endpoint accessible only by end users.
    """
    permission_classes = [IsAuthenticated, IsEndUser]

    def get(self, request):
        return Response({"message": "Welcome, End User!"})

class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            reset_link = f"http://localhost:3000/reset-password/{user.id}/"
            send_mail(
                "Password Reset Request",
                f"Click the link to reset your password: {reset_link}",
                environ.get('EMAIL_HOST_USER'),
                [email],
            )
            return Response({"message": "Password reset email sent successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Failed to send reset email to {email}: {str(e)}")
            return Response({"error": "Failed to send reset email."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordConfirmView(APIView):
    """
    Handles password reset confirmation by setting a new password for the user.
    """
    def post(self, request, user_id):
        new_password = request.data.get('password')
        try:
            user = User.objects.get(id=user_id)
            user.password = make_password(new_password)  # Hash the password
            user.save()
            return Response({"message": "Password reset successfully!"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            logger.error(f"User with ID {user_id} does not exist.")
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error resetting password for user {user_id}: {str(e)}")
            return Response({"error": "Failed to reset password."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)