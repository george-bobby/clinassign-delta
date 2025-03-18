// Attendance Reports API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    // Extract JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Invalid token or user not found' });
    }

    // Set user data and Supabase session for further requests
    req.user = userData.user;
    supabase.auth.setSession({ access_token: token, refresh_token: '' });
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Authorization middleware
const authorizeUser = async (req, res, next) => {
  try {
    // Get current user's role from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (profileError) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const userRole = profileData.role;

    // Check if user has permission to generate reports
    if (!['tutor', 'nursing_head', 'hospital_admin', 'principal'].includes(userRole)) {
      return res.status(403).json({ error: 'Unauthorized to generate attendance reports' });
    }

    req.userRole = userRole;
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET attendance-reports - Generate attendance reports
app.get('/attendance-reports', authenticateUser, authorizeUser, async (req, res) => {
  try {
    // Extract query parameters
    const type = req.query.type || 'daily';
    const { start_date, end_date, department, student_id } = req.query;

    // Validate required parameters
    if (!start_date) {
      return res.status(400).json({ error: 'start_date is required' });
    }

    // Build the base query
    let query = supabase
      .from('attendance_records')
      .select('*')
      .gte('date', start_date);

    // Apply end date filter if provided
    if (end_date) {
      query = query.lte('date', end_date);
    }

    // Apply department filter if provided
    if (department) {
      query = query.eq('department', department);
    }

    // Apply student filter if provided
    if (student_id) {
      query = query.eq('student_id', student_id);
    }

    // Execute the query
    const { data: reportData, error: reportError } = await query;

    if (reportError) {
      return res.status(500).json({ error: reportError.message });
    }

    // Process the data based on report type
    let processedData;
    if (type === 'daily') {
      // Group by date
      processedData = groupByDate(reportData);
    } else if (type === 'department') {
      // Group by department
      processedData = groupByDepartment(reportData);
    } else if (type === 'student') {
      // Group by student
      processedData = groupByStudent(reportData);
    } else {
      // Default raw data
      processedData = reportData;
    }

    return res.json({
      report_type: type,
      start_date,
      end_date,
      data: processedData
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST attendance-reports/export - Export attendance reports
app.post('/attendance-reports/export', authenticateUser, authorizeUser, async (req, res) => {
  try {
    const { format, reportData } = req.body;

    // Validate request body
    if (!format || !reportData) {
      return res.status(400).json({ error: 'Missing required fields: format, reportData' });
    }

    // Generate a file name for the report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `attendance_report_${timestamp}.${format}`;

    // In a real implementation, this would generate the actual file
    // For this example, we'll return a download URL
    
    return res.json({
      message: 'Report generated successfully',
      download_url: `${supabaseUrl}/storage/v1/object/public/reports/${fileName}`,
      file_name: fileName
    });
  } catch (error) {
    console.error('Error exporting report:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Helper functions for data processing

function groupByDate(records) {
  const groupedData = {};
  
  records.forEach(record => {
    const date = record.date;
    if (!groupedData[date]) {
      groupedData[date] = {
        date,
        total: 0,
        present: 0,
        absent: 0,
        records: []
      };
    }
    
    groupedData[date].total++;
    if (record.status === 'Present') {
      groupedData[date].present++;
    } else {
      groupedData[date].absent++;
    }
    
    groupedData[date].records.push(record);
  });
  
  return Object.values(groupedData);
}

function groupByDepartment(records) {
  const groupedData = {};
  
  records.forEach(record => {
    const department = record.department;
    if (!groupedData[department]) {
      groupedData[department] = {
        department,
        total: 0,
        present: 0,
        absent: 0,
        records: []
      };
    }
    
    groupedData[department].total++;
    if (record.status === 'Present') {
      groupedData[department].present++;
    } else {
      groupedData[department].absent++;
    }
    
    groupedData[department].records.push(record);
  });
  
  return Object.values(groupedData);
}

function groupByStudent(records) {
  const groupedData = {};
  
  records.forEach(record => {
    const studentId = record.student_id;
    if (!groupedData[studentId]) {
      groupedData[studentId] = {
        student_id: studentId,
        student_name: record.student_name,
        total: 0,
        present: 0,
        absent: 0,
        records: []
      };
    }
    
    groupedData[studentId].total++;
    if (record.status === 'Present') {
      groupedData[studentId].present++;
    } else {
      groupedData[studentId].absent++;
    }
    
    groupedData[studentId].records.push(record);
  });
  
  return Object.values(groupedData);
}

module.exports = app;