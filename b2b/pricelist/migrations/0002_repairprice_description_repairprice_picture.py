# Generated by Django 5.1.1 on 2024-11-18 20:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pricelist', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='repairprice',
            name='description',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='repairprice',
            name='picture',
            field=models.TextField(blank=True, null=True),
        ),
    ]
