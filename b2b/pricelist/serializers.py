from rest_framework import serializers
from .models import Model, RepairPrice, Category, Series

class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Series
        fields = '__all__'

class RepairPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepairPrice
        fields = '__all__'
