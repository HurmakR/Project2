# Generated by Django 5.1.1 on 2024-11-18 22:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='RepairType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Series',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='series', to='pricelist.category')),
            ],
        ),
        migrations.CreateModel(
            name='Model',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='models', to='pricelist.category')),
                ('series', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='models', to='pricelist.series')),
            ],
        ),
        migrations.CreateModel(
            name='RepairPrice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('retail_stock_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='Stock Retail Price')),
                ('retail_exchange_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='Exchange Retail Price')),
                ('dealer_stock_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='Stock Dealer Price')),
                ('dealer_exchange_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='Exchange Dealer Price')),
                ('description', models.CharField(blank=True, max_length=200, null=True)),
                ('picture', models.TextField(blank=True, null=True)),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='category_prices', to='pricelist.category')),
                ('model', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='model_prices', to='pricelist.model')),
                ('repair_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prices', to='pricelist.repairtype')),
                ('series', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='series_prices', to='pricelist.series')),
            ],
            options={
                'unique_together': {('repair_type', 'category', 'series', 'model')},
            },
        ),
    ]
