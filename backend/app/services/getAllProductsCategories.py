from beanie import PydanticObjectId
from app.models.product import Product


async def get_all_categories():
    pipeline = [
        {"$unwind": "$categories"},
        {"$group": {"_id": None, "all_categories": {"$addToSet": "$categories"}}},
        {"$project": {"_id": 0, "all_categories": 1}},
    ]

    # use the underlying pymongo/motor collection to get a native async cursor
    collection = Product.get_pymongo_collection()
    cursor = collection.aggregate(pipeline)
    result = []
    async for doc in cursor:
        result.append(doc)

    if result:
        return result[0]["all_categories"]

    return []
