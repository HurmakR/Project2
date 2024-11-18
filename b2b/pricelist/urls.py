from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ModelViewSet, RepairPriceViewSet, CategoryViewSet, SeriesViewSet

router = DefaultRouter()
router.register(r'models', ModelViewSet)
router.register(r'repair-prices', RepairPriceViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'series', SeriesViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
