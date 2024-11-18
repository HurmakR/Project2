from django.contrib import admin
from .models import Category, Series, Model, RepairType, RepairPrice

admin.site.register(Category)
admin.site.register(Series)
admin.site.register(Model)
admin.site.register(RepairType)
admin.site.register(RepairPrice)