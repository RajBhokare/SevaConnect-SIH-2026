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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
