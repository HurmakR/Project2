from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role='end_user'  # Default role for new users
        )


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for returning user details.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'company']
