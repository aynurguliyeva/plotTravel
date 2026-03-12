import os

# These match your docker-compose.yml exactly
DB_USER = "travel_user"
DB_PASSWORD = "travel_pass"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "travel_db"

# The full connection string SQLAlchemy needs
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

class Settings:
    PROJECT_NAME: str = "AI Travel Planner"
    SQLALCHEMY_DATABASE_URL: str = DATABASE_URL

settings = Settings()