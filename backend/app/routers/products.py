from fastapi import APIRouter, Response, HTTPException, Depends, Query
from app.models.product import Product
import httpx
from app.services.searchProducts import searchProductsService, ProductSearchParams
from app.services.authentificateUser import require_role
from typing import Optional, List
from app.services.getAllProductsCategories import get_all_categories

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/")
async def getAllProducts():
    products= await Product.find_all().to_list()
    return products

@router.post("/fetch/{count}")
async def addFromExternalAPI(count: int= 1, user=Depends(require_role("admin"))):
    url= 'https://fakestoreapi.com/products'

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    
    if response.status_code != 200:
        raise HTTPException(400, "Failed to fetch external products")
    
    external_products= response.json()

    inserted= 0
    
    for p in external_products:
        print(p.get("category","non"))
        product = Product( title=p["title"], price=p["price"], 
                           description=p.get("description", ""),
                           categories= [p.get("category","")],
                           image= p.get("image", "")
                           ) 
        await product.insert() 
        inserted+=1
        if inserted>= count:
            break

    return {"requested": count, "inserted": inserted}



@router.delete("/{product_id}")
async def removeProduct(product_id: str, user=Depends(require_role("admin"))):
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    
    await product.delete()
    return {"message": "Product Removed"}


@router.post("/")
async def createProduct(product: Product, user=Depends(require_role("admin"))):
    await product.insert()
    return product


def get_search_params(
    query: Optional[str] = Query(None),
    orderBy: Optional[int] = Query(1),
    minPrice: Optional[float] = Query(None),
    maxPrice: Optional[float] = Query(None),
    categories: Optional[List[str]] = Query(
        None,
        description="One or more categories to filter by. Repeat the parameter or supply a comma-separated list (e.g. ?categories=foo&categories=bar or ?categories=foo,bar).",
    ),
) -> ProductSearchParams:
    """Construct ``ProductSearchParams`` from explicit query params."""
    return ProductSearchParams(
        query=query,
        orderBy=orderBy,
        minPrice=minPrice,
        maxPrice=maxPrice,
        categories=categories,
    )


@router.get("/search")
async def searchProducts(params: ProductSearchParams = Depends(get_search_params)):
    return await searchProductsService(params)

@router.get("/categories")
async def getAllCategories():
    return await get_all_categories()
