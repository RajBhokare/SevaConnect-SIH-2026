import warnings
warnings.filterwarnings("ignore")

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from forecast import forecaster
from allocation import allocator
from ranking import calculate_provider_rank, analyze_single_feedback, RANK_THRESHOLDS

app = FastAPI(
    title="SevaConnect AI Operational & Ranking Engine",
    description="Microservice providing demand forecasting, fair workforce allocation, and multi-factor AI service provider ranking.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()

class ForecastRequest(BaseModel):
    service: str = Field(default="Plumber", examples=["Plumber"])
    locality: Optional[str] = Field(default="Kothrud", examples=["Kothrud"])
    day_of_week: Optional[str] = Field(default="Monday", examples=["Monday"])
    hour: Optional[int] = Field(default=10, ge=0, le=23, examples=[10])
    is_emergency: Optional[bool] = Field(default=False, examples=[False])

class AllocationRequest(BaseModel):
    service: str = Field(default="Plumber")
    locality: Optional[str] = Field(default="Kothrud")
    predicted_demand: Optional[str] = Field(default="HIGH")
    workers: List[Dict[str, Any]] = Field(default=[])

class SingleFeedbackRequest(BaseModel):
    comment: str = Field(default="")
    stars: int = Field(default=5, ge=1, le=5)

class ProviderRankRequest(BaseModel):
    worker: Dict[str, Any]
    ratings: List[Dict[str, Any]] = Field(default=[])
    bookings: Optional[List[Dict[str, Any]]] = Field(default=[])

class BatchRankRequest(BaseModel):
    providers: List[Dict[str, Any]]
    all_ratings: List[Dict[str, Any]] = Field(default=[])
    all_bookings: Optional[List[Dict[str, Any]]] = Field(default=[])

# Backward compatibility request
class SimpleRankRequest(BaseModel):
    rating: float = Field(default=5.0)
    reviews: List[str] = Field(default=[])

@router.get("/health")
def health_check():
    return {
        "success": True,
        "status": "ok",
        "message": "SevaConnect AI service is running",
        "service": "SevaConnect AI Service",
        "engine": "Scikit-Learn + NLP Sentiment Classifier + Bayesian Ranking",
        "llm_dependency": False,
        "ranking_thresholds": RANK_THRESHOLDS
    }

@router.get("/")
def root():
    return {
        "success": True,
        "message": "SevaConnect AI Operational & Ranking Service is running."
    }

@router.post("/forecast")
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

@router.post("/allocate")
def get_allocation(req: AllocationRequest):
    try:
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

@router.post("/analyze-feedback")
def analyze_feedback(req: SingleFeedbackRequest):
    try:
        result = analyze_single_feedback(req.comment, req.stars)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rank-provider")
def rank_provider(req: ProviderRankRequest):
    try:
        result = calculate_provider_rank(req.worker, req.ratings, req.bookings)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rank-all")
def rank_all_providers(req: BatchRankRequest):
    try:
        results = []
        for worker in req.providers:
            w_id = worker.get("_id")
            w_ratings = [r for r in req.all_ratings if r.get("workerId") == w_id]
            w_bookings = [b for b in req.all_bookings if b.get("workerId") == w_id] if req.all_bookings else []
            rank_info = calculate_provider_rank(worker, w_ratings, w_bookings)
            results.append(rank_info)
        return {"providers": results, "thresholds": RANK_THRESHOLDS}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Backward compatibility route
@router.post("/rank")
def rank_worker_compat(req: SimpleRankRequest):
    dummy_worker = {"_id": "dummy", "name": "Provider", "rating": req.rating, "completedJobs": max(len(req.reviews), 10)}
    dummy_ratings = [{"stars": int(round(req.rating)), "comment": r} for r in req.reviews]
    if len(dummy_ratings) < 3:
        # Fill minimum dummy ratings for simple route
        dummy_ratings.extend([{"stars": int(round(req.rating)), "comment": "Good job"} for _ in range(3 - len(dummy_ratings))])
    res = calculate_provider_rank(dummy_worker, dummy_ratings)
    return {
        "rank": res["rank"],
        "final_score": res["score"],
        "original_rating": req.rating,
        "sentiment_adjustment": res["sentimentScore"]
    }

# Register routes at both root and /ai prefix
app.include_router(router)
app.include_router(router, prefix="/ai")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

