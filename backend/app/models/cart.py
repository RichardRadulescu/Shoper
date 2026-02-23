from beanie import Document
from typing import List
from pydantic import BaseModel

class CartItem(BaseModel):
    product_id: str
    quantity: int = 1

class ShoppingCart(Document):
    user_id: str
    items: List[CartItem] = []

    class Settings:
        name = "shopping_carts"
