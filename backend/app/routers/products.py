from fastapi import APIRouter, Response, HTTPException
from app.models.product import Product
import httpx

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/")
async def getAllProducts():
    products= await Product.find_all().to_list()
    return products

@router.post("/fetch/{count}")
async def addFromExternalAPI(count: int):
    url= ""

    async with httpx.AsyncClient as client:
        response = await client.get(url)
    
    if response.status_code != 200:
        raise HTTPException(400, "Failed to fetch external products")
    
    external_products= response.json()

    inserted= []

    for p in external_products:
        product = Product( name=p["name"], price=p["price"], 
                           description=p.get("description", "") 
                           ) 
        await product.insert() 
        inserted.append(product)

    return {"inserted": len(inserted)}



@router.delete("/{product_id}")
async def removeProduct(product_id: str):
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    
    await product.delete()
    return {"message": "Product Removed"}
    