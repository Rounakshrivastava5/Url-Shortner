from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
from typing import Dict
import random, string
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (development only)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

url_store = {}  # short_code -> long_url

# For local development, use localhost with a custom path
BASE_URL = "http://localhost:8000"

# Indian timezone (UTC+5:30)
IST = timezone(timedelta(hours=5, minutes=30))

class ShortenRequest(BaseModel):
    long_url: str
    custom_code: str | None = None
    expire_minutes: int | None = None

@app.post("/shorten")
def shorten_url(request: ShortenRequest):
    # Use custom code if provided
    if request.custom_code:
        if request.custom_code in url_store:
            raise HTTPException(status_code=400, detail="Custom code already in use")
        short_code = request.custom_code
    else:
        # Generate a more readable short code
        short_code = generate_readable_code()

    expiry_time = None    
    if request.expire_minutes:
        # Get current time in Indian timezone and add expiry minutes
        current_time_ist = datetime.now(IST)
        expiry_time = current_time_ist + timedelta(minutes=request.expire_minutes)

    url_store[short_code] = {
        "long_url": request.long_url,
        "expiry_time": expiry_time,
        "created_at": datetime.now(IST)
    }
    return {"short_url": f"{BASE_URL}/{short_code}"}

def generate_readable_code():
    """Generate a more readable short code like Bitly"""
    # Use a mix of letters and numbers, avoiding confusing characters
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    # Remove confusing characters
    chars = chars.replace("0", "").replace("O", "").replace("I", "").replace("l", "")
    
    # Generate 6-8 character code
    length = random.randint(6, 8)
    return ''.join(random.choices(chars, k=length))

@app.get("/list")
def list_urls() -> Dict[str, dict]:
    """List all stored short URLs (for debugging/demo)."""
    return url_store

@app.get("/stats/{short_code}")
def url_stats(short_code: str):
    """Get details about a specific short code."""
    if short_code not in url_store:
        raise HTTPException(status_code=404, detail="Short URL not found")
    record = url_store[short_code]
    return {
        "long_url": record["long_url"],
        "expiry_time": str(record["expiry_time"]) if record["expiry_time"] else "Never",
        "created_at": str(record["created_at"]),
        "short_url": f"{BASE_URL}/{short_code}"
    }            

@app.get("/{short_code}")
def redirect_to_url(short_code: str):
    if short_code not in url_store:
        raise HTTPException(status_code=404, detail="Short URL not found")

    record = url_store[short_code]

    # Check expiry using Indian time
    if record["expiry_time"] and datetime.now(IST) > record["expiry_time"]:
        # Optionally, delete expired entry
        del url_store[short_code]
        raise HTTPException(status_code=410, detail="Short URL expired")

    return RedirectResponse(record["long_url"])

@app.get("/")
def root():
    return {
        "message": "Welcome to URL Shortener API",
        "base_url": BASE_URL,
        "endpoints": {
            "shorten": "POST /shorten",
            "redirect": "GET /{short_code}",
            "stats": "GET /stats/{short_code}",
            "list": "GET /list"
        }
    }

