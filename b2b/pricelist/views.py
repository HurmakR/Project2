from rest_framework import viewsets
from .models import Model, RepairPrice, Category, Series
from .serializers import ModelSerializer, RepairPriceSerializer, CategorySerializer, SeriesSerializer


class ModelViewSet(viewsets.ModelViewSet):
    queryset = Model.objects.all()
    serializer_class = ModelSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class SeriesViewSet(viewsets.ModelViewSet):
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer

class RepairPriceViewSet(viewsets.ModelViewSet):
    queryset = RepairPrice.objects.all()
    serializer_class = RepairPriceSerializer
