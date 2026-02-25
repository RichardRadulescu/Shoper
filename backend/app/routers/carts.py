from fastapi import APIRouter, Depends
from models.cart import CartItem
from app.services.cart_services import (
    get_cart_by_user_id,
    create_empty_cart,
    add_item_to_cart,
    update_item_quantity,
    remove_item_from_cart,
    clear_cart
)
from app.services.authentificateUser import require_role

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("/{user_id}")
async def get_cart(user_id: str, user=Depends(require_role("user"))):
    cart = await get_cart_by_user_id(user_id)
    if not cart:
        cart = await create_empty_cart(user_id)
    return cart


@router.post("/{user_id}/add")
async def add_to_cart(user_id: str, item: CartItem, user=Depends(require_role("user"))):
    return await add_item_to_cart(user_id, item)


@router.put("/{user_id}/update/{product_id}")
async def update_quantity(user_id: str, product_id: str, quantity: int, user=Depends(require_role("user"))):
    return await update_item_quantity(user_id, product_id, quantity)


@router.delete("/{user_id}/remove/{product_id}")
async def remove_item(user_id: str, product_id: str, user=Depends(require_role("user"))):
    return await remove_item_from_cart(user_id, product_id)


@router.delete("/{user_id}/clear")
async def clear_user_cart(user_id: str, user=Depends(require_role("user"))):
    return await clear_cart(user_id)
