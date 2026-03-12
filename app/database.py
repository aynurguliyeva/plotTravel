import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. This looks for the 'DATABASE_URL' variable you set in the Render dashboard
DATABASE_URL = os.getenv("DATABASE_URL")

# 2. Fallback for local development (your old string)
if not DATABASE_URL:
    DATABASE_URL = "postgresql://travel_user:travel_pass@localhost:5432/travel_db"

# 3. Fix for Render/Heroku (they often use 'postgres://' which SQLAlchemy doesn't like)
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Dependency for routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()