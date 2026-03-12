from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.trip import Trip
from app.models.user import User
from app.schemas.trip import TripResponse
from .user import get_current_user

router = APIRouter(prefix="/trips", tags=["Trips"])


# 1️⃣ GET ALL TRIPS
@router.get("/", response_model=List[TripResponse])
def get_my_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trips = db.query(Trip).filter(
        Trip.user_id == current_user.id
    ).all()

    return trips


# 2️⃣ GET SINGLE TRIP
@router.get("/{trip_id}", response_model=TripResponse)
def get_trip_details(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == current_user.id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found or you don't have permission."
        )

    return trip


# 3️⃣ DELETE TRIP (no response_model needed)
@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == current_user.id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found."
        )

    db.delete(trip)
    db.commit()