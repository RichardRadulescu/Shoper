from typing import List, Optional
from beanie.operators import In, GTE, LTE
from app.models.ProductSearchParams import OrderCriterion, ProductSearchParams
from app.models.product import Product
import re

SORT_MAP = { OrderCriterion.TITLE_ALPHA_ASC: ("title", 1),
             OrderCriterion.TITLE_ALPHA_DESC: ("title", -1), 
             OrderCriterion.PRICE_ASC: ("price", 1),
             OrderCriterion.PRICE_DESC: ("price", -1), }

def build_search_filters(params: ProductSearchParams) -> dict:
    """Return a Mongo-compatible filters dict based on the params.

    Debug prints help reveal how FastAPI is passing the categories value.
    """
    # inspect raw categories value
    print("raw categories field:", params.categories, type(params.categories))
    filters: dict = {}

    # Text search
    if params.query:
        filters["title"] = {"$regex": f".*{re.escape(params.query)}.*", "$options": "i"}

    # Price range
    if params.minPrice is not None or params.maxPrice is not None:
        price_filter: dict = {}
        if params.minPrice is not None:
            price_filter["$gte"] = params.minPrice
        if params.maxPrice is not None:
            price_filter["$lte"] = params.maxPrice
        filters["price"] = price_filter

    # Normalize categories into flat list
    cats: list[str] = []
    if params.categories:
        if isinstance(params.categories, str):
            cats = [c.strip() for c in params.categories.split(",") if c.strip()]
        elif isinstance(params.categories, list):
            for element in params.categories:
                if isinstance(element, str):
                    cats.extend([c.strip() for c in element.split(",") if c.strip()])
        else:
            cats = [c.strip() for c in str(params.categories).split(",") if c.strip()]
    if cats:
        filters["categories"] = {"$in": cats}

    return filters


async def searchProductsService(params: ProductSearchParams):
    filters = build_search_filters(params)

    # debug: see what filters we're sending to the database
    print("search filters:", filters)

    criterion = OrderCriterion(params.orderBy)
    # Sorting
    sort_field, sort_dir = SORT_MAP[criterion]

    return (
        await Product
        .find(filters)
        .sort((sort_field, sort_dir))
        .to_list()
    )
