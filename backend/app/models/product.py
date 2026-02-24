from beanie import Document
from typing import Optional, List

class Product(Document):
    title: str
    price: float
    description: Optional[str]
    categories: Optional[List[str]]
    image: Optional[str]

    class Settings:
        name = "products"
