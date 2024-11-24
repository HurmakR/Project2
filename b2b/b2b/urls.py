from django.contrib import admin
from django.urls import path, include
from accounts.views import ResetPasswordConfirmView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/pricelist/', include('pricelist.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('reset-password/<int:user_id>/', ResetPasswordConfirmView.as_view(), name='reset-password-confirm'),
]
