from pydantic import BaseModel
from typing import Any, List, Optional 


class TripResponse(BaseModel):
    id: int
    destinations: List[str]
    destination: Optional[str] = None  # Make it optional
    days: int
    itinerary_data: Any

    class Config:
        from_attributes = True  # ✅ Required for SQLAlchemy (Pydantic v2)