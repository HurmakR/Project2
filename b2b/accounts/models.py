from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('dealer', 'Dealer'),
        ('end_user', 'End User'),
    ]
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='end_user',
        help_text="Role of the user"
    )
    company = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Company associated with the dealer (if applicable)"
    )

    def save(self, *args, **kwargs):
        # Ensure that a dealer must have a company assigned
        if self.role == 'dealer' and not self.company:
            raise ValidationError("Dealers must be associated with a company.")
        super().save(*args, **kwargs)

    def is_admin(self):
        return self.role == 'admin'

    def is_staff_user(self):
        return self.role == 'staff'

    def is_dealer(self):
        return self.role == 'dealer'

    def is_end_user(self):
        return self.role == 'end_user'
