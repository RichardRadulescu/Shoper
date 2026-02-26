from typing import Optional
from app.models.cart import ShoppingCart, CartItem


async def get_cart_by_user_id(user_id: str) -> Optional[ShoppingCart]:
    return await ShoppingCart.find_one(ShoppingCart.user_id == user_id)


async def create_empty_cart(user_id: str) -> ShoppingCart:
    cart = ShoppingCart(user_id=user_id, items=[])
    return await cart.insert()


async def add_item_to_cart(user_id: str, item: CartItem) -> ShoppingCart:
    cart = await get_cart_by_user_id(user_id)
    if not cart:
        cart = await create_empty_cart(user_id)

    for existing in cart.items:
        if existing.product_id == item.product_id:
            existing.quantity += item.quantity
            break
    else:
        cart.items.append(item)

    await cart.save()
    return cart


async def update_item_quantity(user_id: str, product_id: str, quantity: int) -> ShoppingCart:
    cart = await get_cart_by_user_id(user_id)
    if not cart:
        cart = await create_empty_cart(user_id)

    for item in cart.items:
        if item.product_id == product_id:
            item.quantity = quantity
            break

    await cart.save()
    return cart


async def remove_item_from_cart(user_id: str, product_id: str) -> ShoppingCart:
    cart = await get_cart_by_user_id(user_id)
    if not cart:
        cart = await create_empty_cart(user_id)

    cart.items = [item for item in cart.items if item.product_id != product_id]

    await cart.save()
    return cart


async def clear_cart(user_id: str) -> ShoppingCart:
    cart = await get_cart_by_user_id(user_id)
    if not cart:
        cart = await create_empty_cart(user_id)

    cart.items = []
    await cart.save()
    return cart
