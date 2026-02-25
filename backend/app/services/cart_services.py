# services/cart_service.py

from typing import Optional
from models.cart import ShoppingCart, CartItem

async def get_cart_by_user_id(user_id: str) -> Optional[ShoppingCart]:
    return await ShoppingCart.find_one(ShoppingCart.user_id == user_id)


async def create_empty_cart(user_id: str) -> ShoppingCart:
    cart = ShoppingCart(user_id=user_id, items=[])
    return await cart.insert()


async def add_item_to_cart(user_id: str, item: CartItem) -> ShoppingCart:
    cart = await get_cart_by_user_id(user_id)

    # If no cart exists, create one
    if not cart:
        cart = await create_empty_cart(user_id)

    # Check if product already exists → increase quantity
    for existing in cart.items:
        if existing.product_id == item.product_id:
            existing.quantity += item.quantity
            break
    else:
        cart.items.append(item)

    await cart.save()
    return cart
