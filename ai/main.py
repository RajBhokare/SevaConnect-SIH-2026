from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from forecast import forecaster
from allocation import allocator

app = FastAPI(
    title="SevaConnect AI Operational Engine",
    description="Microservice providing demand forecasting and fair workforce allocation for cooperative service networks.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ForecastRequest(BaseModel):
    service: str = Field(default="Plumber", example="Plumber")
    locality: Optional[str] = Field(default="Kothrud", example="Kothrud")
    day_of_week: Optional[str] = Field(default="Monday", example="Monday")
    hour: Optional[int] = Field(default=10, ge=0, le=23, example=10)
    is_emergency: Optional[bool] = Field(default=False, example=False)

class AllocationRequest(BaseModel):
    service: str = Field(default="Plumber")
    locality: Optional[str] = Field(default="Kothrud")
    predicted_demand: Optional[str] = Field(default="HIGH")
    workers: List[Dict[str, Any]] = Field(default=[])

class RankRequest(BaseModel):
    rating: float = Field(default=5.0)
    reviews: List[str] = Field(default=[])

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "SevaConnect AI Service",
        "engine": "Scikit-Learn + Rule Heuristics",
        "llm_dependency": False
    }

@app.get("/")
def root():
    return {"message": "SevaConnect AI Operational Service is running."}

@app.post("/forecast")
def get_forecast(req: ForecastRequest):
    try:
        result = forecaster.predict_demand(
            service=req.service,
            locality=req.locality or "Kothrud",
            day_of_week=req.day_of_week or "Monday",
            hour=req.hour if req.hour is not None else 10,
            is_emergency=bool(req.is_emergency)
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/allocate")
def get_allocation(req: AllocationRequest):
    try:
        # If workers list is empty, supply default sample pool for demo
        workers = req.workers
        if not workers:
            workers = [
                {
                    "_id": "wrk-1",
                    "name": "Santosh Shinde",
                    "primarySkill": "Plumber",
                    "skills": ["Plumber", "Pipe Fitting"],
                    "experience": 8,
                    "rating": 4.9,
                    "verificationStatus": "VERIFIED",
                    "activeWorkload": 1
                },
                {
                    "_id": "wrk-2",
                    "name": "Ganesh More",
                    "primarySkill": "Plumber",
                    "skills": ["Plumber", "Geyser Repair"],
                    "experience": 5,
                    "rating": 4.7,
                    "verificationStatus": "VERIFIED",
                    "activeWorkload": 0
                }
            ]

        result = allocator.compute_allocation(
            service=req.service,
            locality=req.locality or "Kothrud",
            predicted_demand=req.predicted_demand or "HIGH",
            available_workers=workers
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rank")
def rank_worker(req: RankRequest):
    try:
        # Simple heuristic to simulate AI sentiment analysis on feedback
        # 1. Base score starts as their average rating
        score = req.rating
        
        # 2. Adjust based on keyword sentiment in reviews
        positive_words = ["great", "excellent", "prompt", "good", "best", "perfect", "amazing", "professional"]
        negative_words = ["bad", "late", "poor", "unprofessional", "rude", "terrible", "worst", "slow"]
        
        sentiment_adjustment = 0
        for review in req.reviews:
            text = review.lower()
            for word in positive_words:
                if word in text:
                    sentiment_adjustment += 0.1
            for word in negative_words:
                if word in text:
                    sentiment_adjustment -= 0.15
                    
        # Cap sentiment adjustment between -1.0 and +0.5
        sentiment_adjustment = max(-1.0, min(0.5, sentiment_adjustment))
        final_score = score + sentiment_adjustment
        
        # 3. Map final score to 5 Ranks
        if final_score >= 4.8:
            rank = "Diamond"
        elif final_score >= 4.3:
            rank = "Platinum"
        elif final_score >= 3.8:
            rank = "Gold"
        elif final_score >= 3.0:
            rank = "Silver"
        else:
            rank = "Bronze"
            
        return {
            "rank": rank,
            "final_score": round(final_score, 2),
            "original_rating": req.rating,
            "sentiment_adjustment": round(sentiment_adjustment, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
