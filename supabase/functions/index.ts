import express, { Request, Response, NextFunction } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Types
interface AttendanceRecord {
  id?: string;
  student_id: string;
  student_name: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
  department: string;
  marked_by: string;
  remarks?: string;
  created_at?: string;
  updated_at?: string;
}

interface User {
  id: string;
  role: string;
  email: string;
}

// Roles that can mark attendance
const allowedRoles = ['nursing_head', 'tutor', 'hospital_admin', 'principal'];
// Roles that can delete attendance records
const deleteAllowedRoles = ['nursing_head', 'hospital_admin', 'principal'];

// Authentication middleware
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the JWT with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    
    // Get user role from the user table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, role, email')
      .eq('id', user.id)
      .single();
      
    if (userError || !userData) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }
    
    // Attach user data to request for later use
    (req as any).user = userData;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

// Authorization middleware for attendance operations
const authorizeAttendanceOps = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user as User;
  
  if (!user || !allowedRoles.includes(user.role)) {
    return res.status(403).json({ 
      error: 'Forbidden: Only Nursing Heads, Tutors, Hospital Admins, and Principals can mark attendance' 
    });
  }
  
  next();
};

// Authorization middleware specifically for delete operations
const authorizeDeleteOps = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user as User;
  
  if (!user || !deleteAllowedRoles.includes(user.role)) {
    return res.status(403).json({ 
      error: 'Forbidden: Only Nursing Heads, Hospital Admins, and Principals can delete attendance records' 
    });
  }
  
  next();
};

// Endpoints
// GET /attendance - Fetch attendance records with filters & pagination
app.get('/attendance', authenticate, async (req: Request, res: Response) => {
  try {
    const {
      limit = 10,
      offset = 0,
      student_id,
      date,
      department,
      status
    } = req.query;
    
    // Start building the query
    let query = supabase
      .from('attendance')
      .select('*', { count: 'exact' });
    
    // Apply filters if provided
    if (student_id) {
      query = query.eq('student_id', student_id);
    }
    
    if (date) {
      query = query.eq('date', date);
    }
    
    if (department) {
      query = query.eq('department', department);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    // Apply pagination
    query = query
      .order('date', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    res.status(200).json({
      data,
      pagination: {
        total: count,
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error: any) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ 
      error: 'Failed to fetch attendance records',
      details: error.message
    });
  }
});

// GET /attendance/:id - Get a specific attendance record
app.get('/attendance/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Attendance record not found' });
      }
      throw error;
    }
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching attendance record:', error);
    res.status(500).json({ 
      error: 'Failed to fetch attendance record',
      details: error.message
    });
  }
});

// POST /attendance - Mark attendance (only allowed roles)
app.post('/attendance', authenticate, authorizeAttendanceOps, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as User;
    const attendanceData: AttendanceRecord = req.body;
    
    // Validate required fields
    const requiredFields = ['student_id', 'student_name', 'date', 'status', 'department'];
    for (const field of requiredFields) {
      if (!attendanceData[field as keyof AttendanceRecord]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    
    // Validate status enum
    if (!['present', 'absent', 'leave'].includes(attendanceData.status)) {
      return res.status(400).json({ 
        error: 'Invalid status value. Must be one of: present, absent, leave' 
      });
    }
    
    // Generate a UUID if not provided
    if (!attendanceData.id) {
      attendanceData.id = uuidv4();
    }
    
    // Set the marked_by field to the current user's ID
    attendanceData.marked_by = user.id;
    
    // Check if a record already exists for this student on this date
    const { data: existingRecord } = await supabase
      .from('attendance')
      .select('id')
      .eq('student_id', attendanceData.student_id)
      .eq('date', attendanceData.date)
      .single();
      
    if (existingRecord) {
      return res.status(409).json({ 
        error: 'Attendance record already exists for this student on this date',
        existingId: existingRecord.id
      });
    }
    
    // Insert the new record
    const { data, error } = await supabase
      .from('attendance')
      .insert([attendanceData])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating attendance record:', error);
    res.status(500).json({ 
      error: 'Failed to create attendance record',
      details: error.message
    });
  }
});

// PUT /attendance/:id - Update attendance record (only allowed roles)
app.put('/attendance/:id', authenticate, authorizeAttendanceOps, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user as User;
    const updateData: Partial<AttendanceRecord> = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_at;
    
    // Set the updated_at timestamp
    updateData.updated_at = new Date().toISOString();
    
    // Check if the record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('attendance')
      .select('*')
      .eq('id', id)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Attendance record not found' });
      }
      throw checkError;
    }
    
    // Validate status enum if provided
    if (updateData.status && !['present', 'absent', 'leave'].includes(updateData.status)) {
      return res.status(400).json({ 
        error: 'Invalid status value. Must be one of: present, absent, leave' 
      });
    }
    
    // Update the record
    const { data, error } = await supabase
      .from('attendance')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error updating attendance record:', error);
    res.status(500).json({ 
      error: 'Failed to update attendance record',
      details: error.message
    });
  }
});

// DELETE /attendance/:id - Delete a record (only Nursing Head & above)
app.delete('/attendance/:id', authenticate, authorizeDeleteOps, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if the record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('attendance')
      .select('id')
      .eq('id', id)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Attendance record not found' });
      }
      throw checkError;
    }
    
    // Delete the record
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting attendance record:', error);
    res.status(500).json({ 
      error: 'Failed to delete attendance record',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`ClinAssign Attendance API running on port ${PORT}`);
});

// Error handling for unhandled routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;