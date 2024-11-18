from .models import RepairPrice


def get_repair_price(repair_type, model=None, series=None, category=None):
    # Priority: modle -> series -> category
    if model:
        price = RepairPrice.objects.filter(repair_type=repair_type, model=model).first()
        if price:
            return price

    if series:
        price = RepairPrice.objects.filter(repair_type=repair_type, series=series).first()
        if price:
            return price

    if category:
        price = RepairPrice.objects.filter(repair_type=repair_type, category=category).first()
        if price:
            return price

    return None  # If price is not found
