from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import campaigns, health

app = FastAPI(
    title="Marketing Campaign Generator API",
    description="API for generating marketing campaigns using AI",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(campaigns.router, prefix="/api/campaigns", tags=["Campaigns"])


@app.get("/")
async def root():
    return {"message": "Marketing Campaign Generator API", "docs": "/docs"}
