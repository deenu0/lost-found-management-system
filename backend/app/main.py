from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import items, claims, admin
import os

app = FastAPI(title="Lost and Found API", version="1.0.0")

FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(items.router,  prefix="/api/v1")
app.include_router(claims.router, prefix="/api/v1")
app.include_router(admin.router,  prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Lost and Found API is running!"}

@app.get("/health")
async def health():
    return {"status": "ok"}