from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.trip import Trip
from app.routes.user import get_current_user  # USE THIS ONE
from app.services.llm import generate_ai_itinerary
from app.services.geocoding import geocode_city
# ✅ Proper router definition
router = APIRouter(prefix="/ai", tags=["AI"])


# ✅ Request schema
class ItineraryRequest(BaseModel):
    destinations: list[str]  # Change from single destination to list
    days: int
    preferences: list[str] = []

@router.post("/itinerary")
def generate_itinerary(
    data: ItineraryRequest,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Join destinations for display or handle multiple cities
    destination_str = " → ".join(data.destinations)
    
    # Generate AI Plan (you'll need to update your LLM service to handle multiple cities)
    plan = generate_ai_itinerary(
        data.destinations,  # Pass the list
        data.days,
        data.preferences
    )

    coordinates = []
    for city in data.destinations:
        geo = geocode_city(city)
        if geo:
            coordinates.append(geo)

    # Save to DB
    new_trip = Trip(
        user_id=user.id,
        destinations=data.destinations,  # Store as joined string
        days=data.days,
        itinerary_data=plan,
        coordinates=coordinates
    )

    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)

    return {
        "trip_id": new_trip.id,
        "user": user.email,
        "itinerary": new_trip.itinerary_data,
        "coordinates": new_trip.coordinates
    }