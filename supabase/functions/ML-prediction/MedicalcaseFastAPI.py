from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import logging
from datetime import datetime
import os
from dotenv import load_dotenv
from supabase import create_client
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI(
    title="Medical Case Studies API",
    description="API for processing medical case studies and predicting grades",
    version="1.0.0"
)


# Allow requests from React frontend (Change "http://localhost:3000" if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import functions from updated scripts
from featureextraction import (
    process_case_studies, 
    extract_features,
    insert_extracted_features,
    mark_case_study_as_processed
)
from predictiongrade import insert_rf_predictions

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("app.log")
    ]
)
logger = logging.getLogger(__name__)



# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials are missing! Set them in the .env file.")

# Define a dependency for Supabase client
def get_supabase_client():
    return create_client(SUPABASE_URL, SUPABASE_KEY)

# Pydantic models
class CaseStudy(BaseModel):
    id: str
    text: str
    processed: bool = False
    created_at: Optional[datetime] = None

class CaseStudyIn(BaseModel):
    text: str

class ExtractedFeatures(BaseModel):
    case_study_id: str
    features: Dict[str, Any]
    created_at: Optional[datetime] = None

class Prediction(BaseModel):
    case_study_id: str
    grade: str
    confidence: Optional[float] = None
    created_at: Optional[datetime] = None

class CaseStudyWithPrediction(BaseModel):
    case_study: CaseStudy
    prediction: Optional[Prediction] = None

class ProcessResponse(BaseModel):
    message: str
    processed_count: int

# Background task functions
def bg_process_case_studies():
    logger.info("Starting background task: Processing case studies")
    try:
        process_case_studies()
        logger.info("Successfully processed case studies")
    except Exception as e:
        logger.error(f"Error in bg_process_case_studies: {str(e)}")

def bg_train_model():
    """Run the model training in the background"""
    logger.info("Starting background task: Training model")
    try:
        insert_rf_predictions()
        logger.info("Successfully trained model and inserted predictions")
    except Exception as e:
        logger.error(f"Error in bg_train_model: {str(e)}")

# API Endpoints
@app.get("/")
def read_root():
    return {"message": "Welcome to the ClinAssign Medical Case Studies API"}

@app.post("/case_studies/", response_model=CaseStudy)
async def create_case_study(case_study: CaseStudyIn, supabase=Depends(get_supabase_client)):
    """Create a new case study record"""
    try:
        new_case = {
            "text": case_study.text,
            "processed": False,
            "created_at": datetime.now()
        }
        response = supabase.table('case_studies').insert(new_case).execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Error creating case study: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create case study: {str(e)}")

@app.get("/case_studies/unprocessed", response_model=List[CaseStudy])
async def get_unprocessed_case_studies(supabase=Depends(get_supabase_client)):
    """Get all unprocessed case studies"""
    try:
        response = supabase.table('case_studies').select('*').eq('processed', False).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching unprocessed case studies: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch unprocessed case studies: {str(e)}")

@app.post("/process_case_studies/", response_model=ProcessResponse)
async def run_process_case_studies(background_tasks: BackgroundTasks, supabase=Depends(get_supabase_client)):
    """Process all unprocessed case studies"""
    try:
        # Count unprocessed case studies before processing
        response = supabase.table('case_studies').select('id').eq('processed', False).execute()
        unprocessed_count = len(response.data)
        
        if unprocessed_count == 0:
            return ProcessResponse(message="No unprocessed case studies found", processed_count=0)
        
        # Add the processing task to background tasks
        background_tasks.add_task(bg_process_case_studies)
        
        return ProcessResponse(
            message=f"Processing {unprocessed_count} case studies in the background",
            processed_count=unprocessed_count
        )
    except Exception as e:
        logger.error(f"Error starting case study processing: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to start processing: {str(e)}")

@app.post("/train_model/")
async def train_model(background_tasks: BackgroundTasks):
    """Train the model and generate predictions"""
    try:
        background_tasks.add_task(bg_train_model)
        return {"message": "Model training started in the background"}
    except Exception as e:
        logger.error(f"Error starting model training: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to start model training: {str(e)}")

@app.get("/predictions/{case_study_id}", response_model=Prediction)
async def get_prediction(case_study_id: str, supabase=Depends(get_supabase_client)):
    """Get prediction for a specific case study"""
    try:
        response = supabase.table('predictions').select('*').eq('case_study_id', case_study_id).execute()

        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail=f"No prediction found for case study ID: {case_study_id}")
        
        return response.data[0]
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        logger.error(f"Error fetching prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch prediction: {str(e)}")

@app.get("/case_studies/{case_study_id}/with_prediction", response_model=CaseStudyWithPrediction)
async def get_case_study_with_prediction(case_study_id: str, supabase=Depends(get_supabase_client)):
    """Get a case study with its prediction"""
    try:
        # Get the case study
        case_study_response = supabase.table('case_studies').select('*').eq('id', case_study_id).execute()
        
        if not case_study_response.data:
            raise HTTPException(status_code=404, detail=f"Case study with ID {case_study_id} not found")
        
        case_study = case_study_response.data[0]
        
        # Get the prediction if it exists
        prediction_response = supabase.table('predictions').select('*').eq('case_study_id', case_study_id).execute()
        prediction = prediction_response.data[0] if prediction_response.data else None
        
        return CaseStudyWithPrediction(
            case_study=case_study,
            prediction=prediction
        )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        logger.error(f"Error fetching case study with prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch case study with prediction: {str(e)}")

@app.get("/status")
async def check_status(supabase=Depends(get_supabase_client)):
    """Check the status of the API and database connection"""
    try:
        # Attempt to connect to Supabase
        response = supabase.table('case_studies').select('count').execute()
        
        return {
            "status": "operational",
            "database_connection": "successful",
            "timestamp": datetime.now()
        }
    except Exception as e:
        logger.error(f"Error checking status: {str(e)}")
        return {
            "status": "degraded",
            "database_connection": "failed",
            "error": str(e),
            "timestamp": datetime.now()
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

@app.get("/predictions", response_model=List[Prediction])
async def get_all_predictions(supabase=Depends(get_supabase_client)):
    """Retrieve all predictions stored in the database"""
    try:
        response = supabase.table("predictions").select("*").execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="No predictions found.")
        return response.data  #Returns all stored predictions
    except Exception as e:
        logger.error(f"Error fetching predictions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch predictions.")