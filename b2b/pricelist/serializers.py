from rest_framework import serializers
from .models import Model, RepairPrice, Category, Series, RepairType


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

class RepairTypeSerializer(serializers.ModelSerializer):
    """
    Serializer for the RepairType model to include the name of the repair type.
    """
    class Meta:
        model = RepairType
        fields = ['id', 'name']  # Include only the fields you need

class RepairPriceSerializer(serializers.ModelSerializer):
    """
    Serializer for the RepairPrice model to include nested repair type information.
    """
    repair_type = RepairTypeSerializer()  # Nested serializer for repair_type

    class Meta:
        model = RepairPrice
        fields = [
            'id', 'repair_type', 'category', 'series', 'model',
            'retail_stock_price', 'retail_exchange_price',
            'dealer_stock_price', 'dealer_exchange_price',
            'service_price', 'description', 'picture'
        ]