from pydantic import BaseModel
from typing import List, Optional
from enum import Enum
from fastapi import Query

class OrderCriterion(Enum):
    TITLE_ALPHA_ASC= 1
    TITLE_ALPHA_DESC= 2
    PRICE_ASC= 3
    PRICE_DESC= 4


class ProductSearchParams(BaseModel):
    query: Optional[str] = None
    orderBy: Optional[int] = 1
    minPrice: Optional[float] = None
    maxPrice: Optional[float] = None
    categories: Optional[List[str]] = Query(
        None,
        description="One or more categories to filter by. Repeat the parameter or supply a comma-separated list (e.g. ?categories=foo&categories=bar or ?categories=foo,bar).",
    )
