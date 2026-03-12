from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. Critical Imports: Import models before anything else 
# to ensure SQLAlchemy registers them correctly.
from app.models.user import User
from app.models.trip import Trip
from app.database import engine, Base

# 2. Import your routers
from app.routes import user, ai, trips

# 3. Create the FastAPI instance
app = FastAPI(
    title="AI Travel Planner",
    description="A smart travel companion powered by Gemini AI and FastAPI",
    version="1.0.0"
)

# 4. CORS Middleware (Essential for connecting to a Frontend later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Database Initialization
# This creates tables if they don't exist (useful for a fresh Docker volume)
Base.metadata.create_all(bind=engine)

# 6. Include Routers
app.include_router(user.router)
app.include_router(ai.router)
app.include_router(trips.router)

# 7. Root Health Check
@app.get("/", tags=["Health"])
def read_root():
    return {
        "status": "online",
        "message": "AI Travel Planner API is running smoothly!"
    }