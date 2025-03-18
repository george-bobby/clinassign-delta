import os
import spacy
import re
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load NLP Model
nlp = spacy.load("en_core_web_sm")

# Define keyword sets globally
medication_keywords = {
    "nitroglycerin", "aspirin", "morphine", "beta-blockers", "diuretics",
    "antihypertensives", "anticoagulants", "bronchodilators", "insulin",
    "oxygen therapy", "iv fluids", "vasopressors", "corticosteroids", "thrombolytics", "ACE inhibitors",
    "statins", "antihistamines", "NSAIDs", "antiarrhythmics", "anticonvulsants",
    "sedatives", "antibiotics", "antipyretics", "muscle relaxants", "antipsychotics",
    "antidepressants", "antiemetics", "proton pump inhibitors", "H2 blockers",
    "DPP-4 inhibitors", "SGLT2 inhibitors", "GLP-1 receptor agonists", "anticholinergics",
    "immunosuppressants", "methotrexate", "lithium", "benzodiazepines", "opioid antagonists",
    "antihyperlipidemics", "antifungals", "antivirals", "monoclonal antibodies",
    "immunoglobulins", "calcium channel blockers", "digoxin", "heparin", "enoxaparin",
    "metformin", "warfarin", "gabapentin", "pregabalin", "atropine", "levothyroxine",
    "amiodarone", "erythropoietin", "diltiazem", "fentanyl", "oxycodone", "hydrocodone",
    "tramadol", "albuterol", "salbutamol", "ipratropium", "clopidogrel", "tPA",
    "methadone", "diphenhydramine", "ketorolac", "fluconazole", "rifampin", "clindamycin",
    "azithromycin", "vancomycin", "adenosine", "dobutamine", "dopamine", "milrinone",
    "spironolactone", "labetalol", "ranitidine", "ondansetron", "scopolamine", "sumatriptan",
    "haloperidol", "chlorpromazine", "baclofen", "lidocaine", "dexamethasone", "prednisone",
    "cyclosporine", "tacrolimus", "phenytoin", "carbamazepine", "allopurinol", "colchicine",
    "bisphosphonates", "sildenafil", "tadalafil", "niacin", "dipyridamole", "methimazole",
    "propylthiouracil", "epoetin alfa"
}

procedure_keywords = {
    "assessment", "monitoring", "monitored", "ecg", "vital signs", "oxygen therapy",
    "positioning", "nebulization", "administered", "blood glucose", "blood pressure",
    "temperature", "pulse", "catheterization", "wound care", "intubation", "defibrillation",
    "telemetry", "respiratory rate monitoring", "IV insertion", "neurological assessment",
    "dialysis", "transfusion", "central line placement", "lumbar puncture", "mechanical ventilation",
    "endoscopy", "biopsy", "echocardiography", "CT scan", "MRI scan", "ultrasound",
    "ABG analysis", "bronchoscopy", "thoracentesis", "pleural tap", "cardiac stress test",
    "electroencephalogram", "blood culture", "urinalysis", "sputum analysis", "wound culture",
    "nasogastric tube insertion", "pacemaker placement", "cardioversion", "chest tube insertion",
    "tracheostomy care", "gastric lavage", "hemodynamic monitoring", "peritoneal dialysis",
    "indwelling catheter care", "skin integrity assessment", "glucose tolerance test",
    "lactate clearance test", "fluid balance monitoring", "GCS assessment", "Doppler ultrasound",
    "pleural effusion drainage", "sedation protocol", "prone positioning", "infection control measures",
    "sepsis bundle", "hand hygiene compliance", "aspiration precautions", "stroke protocol implementation",
    "blood transfusion reaction monitoring", "medication reconciliation", "post-operative care",
    "fall risk assessment", "wound irrigation", "debridement", "splint application", "suture removal",
    "rapid sequence intubation", "capillary refill time assessment", "neonatal resuscitation protocol",
    "fetal heart monitoring", "APGAR scoring", "cord blood collection", "Kangaroo mother care",
    "pressure ulcer staging", "nasopharyngeal suctioning", "enteral feeding tube placement",
    "oral care protocol", "seclusion/restraint assessment", "psychiatric risk assessment",
    "de-escalation techniques", "hypothermia protocol", "insulin administration protocol",
    "thyroid function testing", "contrast dye allergy screening", "ventilator weaning protocol",
    "hearing/vision screening", "stool sample analysis", "newborn metabolic screening"
}

pain_keywords = {
    "pain assessment", "pain rating", "pain score", "pain level", "morphine",
    "pain management", "pain control", "pain relief", "comfort measures", "pain medication",
    "analgesia", "opioid therapy", "non-opioid pain relief", "TENS", "heat therapy",
    "cold therapy", "acupuncture", "guided imagery", "nerve blocks", "cognitive behavioral therapy",
    "NSAID therapy", "epidural injection", "massage therapy", "aromatherapy", "chiropractic treatment",
    "relaxation techniques", "hypnosis", "music therapy", "mindfulness meditation", "biofeedback",
    "stretching exercises", "aquatic therapy", "yoga for pain relief", "breathing exercises",
    "herbal pain remedies", "distraction techniques", "posture correction therapy", "physical therapy",
    "splinting for pain reduction", "hydrotherapy", "lidocaine patches", "patient-controlled analgesia",
    "trigger point therapy", "deep tissue massage", "virtual reality pain therapy",
    "meditation-based stress relief", "progressive muscle relaxation", "transdermal fentanyl patches",
    "opioids rotation therapy", "stress-induced pain relief", "guided relaxation",
    "electrical stimulation therapy", "serotonin modulation", "dopaminergic pain relief",
    "ketamine infusion therapy", "opioid sparing strategies", "mirror therapy",
    "thoracic epidural analgesia", "radiofrequency ablation", "functional rehabilitation",
    "palliative pain care", "osteopathic manipulative treatment", "psychological pain therapy",
    "sleep hygiene education", "serotonin-norepinephrine reuptake inhibitors"
}

diagnosis_keywords = {
    "hypoglycemia", "arrhythmia", "pneumonia", "asthma exacerbation", "congestive heart failure",
    "hypertensive crisis", "myocardial infarction", "dehydration", "hypothyroid crisis", "unstable angina",
    "sepsis", "stroke", "deep vein thrombosis", "pulmonary embolism", "renal failure", "COPD",
    "anemia", "hyperkalemia", "diabetic ketoacidosis", "pancreatitis", "meningitis", "encephalitis",
    "epilepsy", "tuberculosis", "hepatitis", "cirrhosis", "ulcerative colitis", "Crohn's disease",
    "multiple sclerosis", "lupus", "rheumatoid arthritis", "gout", "osteoporosis", "fibromyalgia",
    "Lyme disease", "cellulitis", "Bell's palsy", "Guillain-Barré syndrome", "tetanus",
    "endocarditis", "pericarditis", "myocarditis", "appendicitis", "gallstones", "diverticulitis",
    "liver failure", "hemophilia", "ischemic stroke", "hemorrhagic stroke", "shock",
    "metabolic acidosis", "hyperthyroidism", "Addison's disease", "Cushing's syndrome",
    "bipolar disorder", "schizophrenia", "major depressive disorder", "borderline personality disorder",
    "alcohol withdrawal syndrome"
}


def normalize_text(text):
    """Normalize text by handling special characters and case"""
    if not isinstance(text, str):
        return ""
    # Convert to lowercase
    text = text.lower()
    # Replace hyphens with spaces
    text = text.replace('-', ' ')
    # Replace apostrophes with empty string
    text = text.replace("'", '')
    # Replace multiple spaces with single space
    text = re.sub(r'\s+', ' ', text)
    # Remove any non-alphanumeric characters except spaces
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return text.strip()

def create_pattern(keyword):
    """Create a regex pattern that handles special characters and case"""
    # Normalize the keyword
    normalized = normalize_text(keyword)
    # Escape special regex characters
    escaped = re.escape(normalized)
    # Create pattern that matches word boundaries
    return r'\b' + escaped + r'\b'

def count_keywords_with_entities(text, keyword_set, entity_labels):
    """Count keywords using both regex and spaCy entity recognition"""
    if not isinstance(text, str):
        return 0
        
    text_lower = normalize_text(text)
    count = 0
    found_keywords = set()  # Track unique matches to avoid double counting
    
    try:
        # Process text with spaCy
        doc = nlp(text)
        
        # First check spaCy entities
        for ent in doc.ents:
            if ent.label_ in entity_labels:
                ent_text = normalize_text(ent.text)
                for keyword in keyword_set:
                    keyword_normalized = normalize_text(keyword)
                    if keyword_normalized in ent_text or ent_text in keyword_normalized:
                        found_keywords.add(keyword_normalized)
                        count += 1
        
        # Then check our keyword list with regex
        for keyword in keyword_set:
            pattern = create_pattern(keyword)
            matches = re.finditer(pattern, text_lower)
            for match in matches:
                matched_text = normalize_text(match.group())
                if matched_text not in found_keywords:
                    found_keywords.add(matched_text)
                    count += 1
    except Exception as e:
        print(f"Error processing text: {str(e)}")
        # Fallback to simple keyword matching if spaCy fails
        for keyword in keyword_set:
            pattern = create_pattern(keyword)
            matches = re.finditer(pattern, text_lower)
            for match in matches:
                matched_text = normalize_text(match.group())
                if matched_text not in found_keywords:
                    found_keywords.add(matched_text)
                    count += 1
    
    return count

def count_medications(text):
    return count_keywords_with_entities(text, medication_keywords, ['CHEMICAL', 'DRUG'])

def count_procedures(text):
    return count_keywords_with_entities(text, procedure_keywords, ['PROCEDURE', 'TEST'])

def count_pain_management(text):
    return count_keywords_with_entities(text, pain_keywords, ['PROCEDURE', 'CHEMICAL'])

def identify_diagnoses(text):
    return count_keywords_with_entities(text, diagnosis_keywords, ['DISEASE', 'DIAGNOSIS'])



def insert_extracted_features(case_study_id, features):
    """Insert extracted features into the 'extracted_features' table in Supabase."""
    feature_data = {
        "case_study_id": case_study_id,
        "features": features,
    }
    supabase.table('extracted_features').insert(feature_data).execute()

def extract_features(text):
    """Extract features from case study text."""
    try:
        # Extract age and gender from the case study text
        age_match = re.search(r'(\d+)-year-old', text)
        age = int(age_match.group(1)) if age_match else 0
        
        gender = "female" if "female" in text.lower() else "male" if "male" in text.lower() else "unknown"
        
        # Count features
        medications_count = count_medications(text)
        procedures_count = count_procedures(text)
        pain_management_count = count_pain_management(text)
        diagnoses_count = identify_diagnoses(text)
        
        features = {
            "Medications Administered": medications_count,
            "Procedures Performed": procedures_count,
            "Pain Management Strategies": pain_management_count,
            "Identification of Diagnoses": diagnoses_count,
            "Patient Stabilization": 1 if "stabilized" in text.lower() else 0,
            "Improvement in Symptoms": 1 if "improved" in text.lower() else 0,
            "Documentation Accuracy": 1 if "documented" in text.lower() else 0,
            "Collaboration with Healthcare Team": 1 if "communicated" in text.lower() else 0,
            "Sentiment Analysis": 1 if any(word in text.lower() for word in ["improved", "stabilized", "better"]) else 0,
            "Age": age,
            "Gender": gender
        }
        return features
    except Exception as e:
        print(f"Error extracting features: {str(e)}")
        return {
            "Medications Administered": 0,
            "Procedures Performed": 0,
            "Pain Management Strategies": 0,
            "Identification of Diagnoses": 0,
            "Patient Stabilization": 0,
            "Improvement in Symptoms": 0,
            "Documentation Accuracy": 0,
            "Collaboration with Healthcare Team": 0,
            "Sentiment Analysis": 0,
            "Age": 0,
            "Gender": "unknown"
        }

def mark_case_study_as_processed(case_study_id):
    """Mark case study as processed."""
    response = supabase.table('case_studies').update({"processed": True}).eq('id', case_study_id).execute()
    return response

def process_case_studies():
    # Load case studies that are not yet processed (processed = False)
    case_studies = supabase.table('case_studies').select('*').filter('processed', 'eq', False).execute().data
    
    for case_study in case_studies:
        case_study_id = case_study['id']
        case_text = case_study['text']
        
        # Extract features from the case study
        features = extract_features(case_text)
        
        # Insert extracted features into the 'extracted_features' table
        insert_extracted_features(case_study_id, features)
        
        # Mark the case study as processed
        supabase.table('case_studies').update({'processed': True}).eq('id', case_study_id).execute()

# Start the processing
process_case_studies()
