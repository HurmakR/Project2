from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError


class User(AbstractUser):
    """
    Custom User model extending AbstractUser with additional fields and methods.
    """
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('dealer', 'Dealer'),
        ('end_user', 'End User'),
    ]

    email = models.EmailField(unique=True, verbose_name="Email Address")
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='end_user',
        verbose_name="User Role"
    )
    company = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Company Name"
    )

    def save(self, *args, **kwargs):
        """
        Ensure that a dealer must have a company assigned.
        """
        if self.role == 'dealer' and not self.company:
            raise ValidationError("Dealers must be associated with a company.")
        super().save(*args, **kwargs)

    def is_admin(self):
        """
        Check if the user is an admin.
        """
        return self.role == 'admin'

    def is_staff_user(self):
        """
        Check if the user is a staff member.
        """
        return self.role == 'staff'

    def is_dealer(self):
        """
        Check if the user is a dealer.
        """
        return self.role == 'dealer'

    def is_end_user(self):
        """
        Check if the user is an end user.
        """
        return self.role == 'end_user'

    def __str__(self):
        """
        String representation of the user.
        """
        return f"{self.username} ({self.role})"
