from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.models.user import User
from app.models.product import Product
from app.models.cart import ShoppingCart
from dotenv import load_dotenv
import os
from urllib.parse import quote_plus

load_dotenv()
username = quote_plus(os.getenv("MONGO_USER")) 
password = quote_plus(os.getenv("MONGO_PASS")) 
host = os.getenv("MONGO_HOST") 
db_name = os.getenv("MONGO_DB")

MONGO_URI = f"mongodb+srv://{username}:{password}@{host}/{db_name}?retryWrites=true&w=majority"

async def init_db():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["myshop"]

    await init_beanie(
        database=db,
        document_models=[User, Product, ShoppingCart]
    )
