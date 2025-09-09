from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
from typing import Dict
import random, string

app = FastAPI()

url_store = {}  # short_code -> long_url

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
        short_code = ''.join(random.choices(string.ascii_letters + string.digits, k=6))

    expiry_time = None    
    if request.expire_minutes:
        # Get current time in Indian timezone and add expiry minutes
        current_time_ist = datetime.now(IST)
        expiry_time = current_time_ist + timedelta(minutes=request.expire_minutes)

    url_store[short_code] = {
        "long_url": request.long_url,
        "expiry_time": expiry_time
    }
    return {"short_url": f"http://localhost:8000/{short_code}"}

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

