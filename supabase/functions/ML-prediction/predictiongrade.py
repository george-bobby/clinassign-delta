import os
import pandas as pd
from supabase import create_client
from uuid import UUID
from dotenv import load_dotenv
from datetime import datetime
import logging

# Set logging level to WARNING for 'httpx' to suppress HTTP request logs
logging.getLogger('httpx').setLevel(logging.WARNING)

# Set the root logger level to WARNING to suppress info messages
logging.basicConfig(level=logging.WARNING)

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Configure logging for production
logger = logging.getLogger(__name__)

# Load data from Supabase 'extracted_features' table
def load_extracted_features():
    response = supabase.table('extracted_features').select('id, case_study_id, features').execute()
    return response.data  # Returns list of records

# Load dataset from Supabase
extracted_features_data = load_extracted_features()
df = pd.DataFrame(extracted_features_data)

# Unpack JSONB 'features' column into separate columns
df = pd.concat([df[['id', 'case_study_id']], df['features'].apply(pd.Series)], axis=1)  # Include case_study_id

# Drop unnecessary columns if they exist
columns_to_drop = ['Gender', 'Age']
df = df.drop(columns=[col for col in columns_to_drop if col in df.columns])

# Select only the specified columns for feature sum
selected_columns = [
    'Medications Administered',
    'Procedures Performed',
    'Pain Management Strategies',
    'Identification of Diagnoses'
]

# Calculate feature sum for selected columns only
feature_sums = df[selected_columns].sum(axis=1)

# Define grading logic based on new thresholds
def assign_grade(sum_value):
    if sum_value > 15:  # Higher feature counts
        return 'O'
    elif 8 <= sum_value <= 15:  # Medium feature counts
        return 'A'
    else:  # Lower feature counts
        return 'B'

# Generate grades based on feature sums
predicted_grades = feature_sums.apply(assign_grade)

# Create DataFrame with predictions (including 'id' to match case studies)
results_df = pd.DataFrame({
    'id': df['id'],  # Ensure ID is carried over
    'case_study_id': df['case_study_id'],  #Add this line
    'RF_Model_Grade': predicted_grades
})

def insert_rf_predictions():
    """Run the model inference and insert/update predictions in the database."""
    try:
        # Fetch all processed case studies that need predictions
        case_studies = supabase.table('case_studies').select('id').eq('processed', True).execute().data
        if not case_studies:
            logger.warning("No processed case studies found.")
        
        for case in case_studies:
            case_study_id = case['id']

            # Check if a prediction already exists
            existing_prediction = (
                supabase.table('predictions')
                .select("*")
                .eq("case_study_id", case_study_id)
                .execute()
                .data
            )

            if existing_prediction:
                logger.info(f"Skipping prediction: Already exists for {case_study_id}")
                continue  # Skip if prediction is already present

            # Check if grade exists in `results_df`
            grade_row = results_df[results_df['case_study_id'] == case_study_id]
            if grade_row.empty:
                logger.warning(f"No grade found for {case_study_id}. Skipping.")
                continue

            # Get grade from results_df
            grade = grade_row['RF_Model_Grade'].values[0]
            
            # Insert the new prediction with datetime serialization fix
            result = supabase.table('predictions').insert({
                "case_study_id": case_study_id,
                "grade": grade,
                "created_at": datetime.utcnow().isoformat()  # Convert datetime to ISO string format
            }).execute()

            # Check if the insertion was successful using response's status code
            if result.status_code != 201:
                logger.error(f"Failed to insert prediction for {case_study_id}. Response: {result}")
            else:
                logger.info(f"Inserted new prediction for {case_study_id}")

    except Exception as e:
        logger.error(f"Error inserting predictions: {e}")


# Insert the predictions
insert_rf_predictions()
