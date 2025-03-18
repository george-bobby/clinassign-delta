
import { supabase } from "@/integrations/supabase/client";
import { CaseStudy } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

// Fetch all case studies
export async function fetchCaseStudies() {
  const { data, error } = await supabase
    .from('case_studies')
    .select(`
      id,
      text,
      status,
      student_id,
      created_at,
      submitted_at
    `);

  if (error) {
    console.error("Error fetching case studies:", error);
    throw error;
  }

  return data;
}

// Fetch a single case study by ID
export async function fetchCaseStudyById(id: string) {
  const { data, error } = await supabase
    .from('case_studies')
    .select(`
      id,
      text,
      status,
      student_id,
      created_at,
      submitted_at
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching case study with ID ${id}:`, error);
    throw error;
  }

  return data;
}

// Fetch prediction for a case study
export async function fetchPredictionForCaseStudy(caseStudyId: string) {
  const { data, error } = await supabase
    .from('predictions')
    .select('id, case_study_id, grade, created_at')
    .eq('case_study_id', caseStudyId)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching prediction for case study ${caseStudyId}:`, error);
    throw error;
  }

  return data;
}

// Submit a new case study
export async function submitCaseStudy(caseStudyData: { 
  title: string;
  description: string;
  department: string;
  learning_outcomes: string;
  student_id?: string;
}) {
  // In a real app, student_id would come from the authenticated user
  // For now, we'll use a fixed ID or generate one
  const studentId = caseStudyData.student_id || 'demo-student-id';
  
  const { data, error } = await supabase
    .from('case_studies')
    .insert([{
      id: uuidv4(),
      student_id: studentId,
      text: JSON.stringify({
        title: caseStudyData.title,
        description: caseStudyData.description,
        department: caseStudyData.department,
        learning_outcomes: caseStudyData.learning_outcomes
      }),
      status: 'submitted',
      submitted_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error("Error submitting case study:", error);
    throw error;
  }

  return data;
}

// Update an existing case study
export async function updateCaseStudy(id: string, caseStudyData: {
  title?: string;
  description?: string;
  department?: string;
  learning_outcomes?: string;
  status?: string;
}) {
  // First, get the existing case study
  const { data: existingData, error: fetchError } = await supabase
    .from('case_studies')
    .select('text')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error(`Error fetching case study ${id} for update:`, fetchError);
    throw fetchError;
  }

  // Parse the existing text JSON
  let existingText = {};
  try {
    existingText = JSON.parse(existingData.text);
  } catch (e) {
    console.warn(`Could not parse existing text for case study ${id}, using empty object`);
  }

  // Merge with updated data
  const updatedText = {
    ...existingText,
    ...(caseStudyData.title && { title: caseStudyData.title }),
    ...(caseStudyData.description && { description: caseStudyData.description }),
    ...(caseStudyData.department && { department: caseStudyData.department }),
    ...(caseStudyData.learning_outcomes && { learning_outcomes: caseStudyData.learning_outcomes })
  };

  // Prepare the update object
  const updateObject: any = {
    text: JSON.stringify(updatedText)
  };

  // Add status if provided
  if (caseStudyData.status) {
    updateObject.status = caseStudyData.status;
  }

  // Update the case study
  const { data, error } = await supabase
    .from('case_studies')
    .update(updateObject)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating case study ${id}:`, error);
    throw error;
  }

  return data;
}
