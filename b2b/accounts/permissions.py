from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsStaffOrAdmin(BasePermission):
    """
    Allows access to staff and admin users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'staff']

class IsDealer(BasePermission):
    """
    Allows access only to dealer users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'dealer'

class IsEndUser(BasePermission):
    """
    Allows access only to end users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'end_user'
