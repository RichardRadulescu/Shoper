from fastapi import APIRouter
from models.cart import CartItem
from app.services.cart_service import (
    get_cart_by_user_id,
    create_empty_cart,
    add_item_to_cart
)

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("/{user_id}")
async def get_cart(user_id: str):
    cart = await get_cart_by_user_id(user_id)
    if not cart:
        cart = await create_empty_cart(user_id)
    return cart


@router.post("/{user_id}/add")
async def add_to_cart(user_id: str, item: CartItem):
    cart = await add_item_to_cart(user_id, item)
    return cart
