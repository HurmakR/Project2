from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class Category(models.Model):
    """
    Represents a device category, e.g., iPhone, Mac, iPad.
    """
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Series(models.Model):
    """
    Represents a series within a category, e.g., MacBook Pro, iPhone 11 Series.
    """
    category = models.ForeignKey(Category, related_name='series', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} ({self.category.name})"


class Model(models.Model):
    """
    Represents a specific device model, e.g., iPhone 11 Pro, MacBook Pro 13".
    Can be linked to either a Series or a Category.
    """
    series = models.ForeignKey(Series, related_name='models', on_delete=models.CASCADE, blank=True, null=True)
    category = models.ForeignKey(Category, related_name='models', on_delete=models.CASCADE, blank=True, null=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class RepairType(models.Model):
    """
    Represents a type of repair service, e.g., Screen Replacement, Battery Replacement.
    """
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class RepairPrice(models.Model):
    """
    Represents the price of a repair service, which can be set at different levels:
    - Category level: applies to all models in the category
    - Series level: applies to all models within a series
    - Model level: applies to a specific model
    The price hierarchy is: Model > Series > Category.
    """
    repair_type = models.ForeignKey(RepairType, related_name='prices', on_delete=models.CASCADE)

    # Prices can be set at the category, series, or model level
    category = models.ForeignKey(Category, related_name='category_prices', on_delete=models.CASCADE, blank=True,
                                 null=True)
    series = models.ForeignKey(Series, related_name='series_prices', on_delete=models.CASCADE, blank=True, null=True)
    model = models.ForeignKey(Model, related_name='model_prices', on_delete=models.CASCADE, blank=True, null=True)

    # Four price types: stock and exchange prices for retail and dealer
    retail_stock_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Stock Retail Price",
                                             blank=True, null=True)
    retail_exchange_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Exchange Retail Price",
                                                blank=True, null=True)
    dealer_stock_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Stock Dealer Price",
                                             blank=True, null=True)
    dealer_exchange_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Exchange Dealer Price",
                                                blank=True, null=True)
    service_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Service only price",
                                                blank=True, null=True)
    description = models.CharField(blank=True, null=True, max_length=200)
    picture = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('repair_type', 'category', 'series', 'model')

    def __str__(self):
        if self.model:
            return f"{self.repair_type.name} for {self.model.name}"
        elif self.series:
            return f"{self.repair_type.name} for {self.series.name} series"
        elif self.category:
            return f"{self.repair_type.name} for {self.category.name} category"
        else:
            return  self.repair_type.name

@receiver(post_save, sender=RepairPrice)
def propagate_price_to_models(sender, instance, **kwargs):
    """
    Automatically propagate price from category or series to models.
    """
    # If the price is defined for a category
    if instance.category and not instance.series and not instance.model:
        # Find all models in this category
        models_in_category = Model.objects.filter(category=instance.category)
        for model in models_in_category:
            RepairPrice.objects.update_or_create(
                repair_type=instance.repair_type,
                model=model,
                defaults={
                    'retail_stock_price': instance.retail_stock_price,
                    'retail_exchange_price': instance.retail_exchange_price,
                    'dealer_stock_price': instance.dealer_stock_price,
                    'dealer_exchange_price': instance.dealer_exchange_price,
                }
            )

    # If the price is defined for a series
    elif instance.series and not instance.model:
        # Find all models in this series
        models_in_series = Model.objects.filter(series=instance.series)
        for model in models_in_series:
            RepairPrice.objects.update_or_create(
                repair_type=instance.repair_type,
                model=model,
                defaults={
                    'retail_stock_price': instance.retail_stock_price,
                    'retail_exchange_price': instance.retail_exchange_price,
                    'dealer_stock_price': instance.dealer_stock_price,
                    'dealer_exchange_price': instance.dealer_exchange_price,
                }
            )