from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from app.database import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    destinations = Column(JSONB, nullable=True)  # Store array of cities
    coordinates = Column(JSONB, nullable=True) 
    days = Column(Integer, nullable=False)
    itinerary_data = Column(JSONB)

    # Link back to the user
    owner = relationship("User", back_populates="trips")