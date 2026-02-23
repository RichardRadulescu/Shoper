from beanie import Document
from typing import Optional

class Product(Document):
    title: str
    price: float
    description: Optional[str]
    category: Optional[str]
    image: Optional[str]

    class Settings:
        name = "products"
