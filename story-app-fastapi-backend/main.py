from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data.database import engine
from models import Base
from controllers import story_controller

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI application
app = FastAPI(
    title="Story Generation API",
    description="An API for generating and managing stories",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include story routes
app.include_router(story_controller.router, prefix="/stories", tags=["stories"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Story Generation API"}

# Database test endpoint
@app.get("/db-test")
def test_db():
    return {"message": "Database connection successful!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
