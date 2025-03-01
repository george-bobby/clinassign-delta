
// Attendance Reports API
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authentication data from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Extract JWT token
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Invalid token or user not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Set Authorization header for Supabase client
    supabase.auth.setSession({ access_token: token, refresh_token: "" });

    // Parse request body for both GET and POST methods
    let requestData = {};
    if (req.method === "GET" || req.method === "POST") {
      try {
        requestData = await req.json();
      } catch (e) {
        // If parsing fails, use URL parameters for GET
        if (req.method === "GET") {
          const url = new URL(req.url);
          requestData = {
            type: url.searchParams.get("type") || "daily",
            start_date: url.searchParams.get("start_date"),
            end_date: url.searchParams.get("end_date"),
            department: url.searchParams.get("department"),
            student_id: url.searchParams.get("student_id")
          };
        }
      }
    }

    // GET attendance-reports - Generate attendance reports
    if (req.method === "GET") {
      const { 
        type = "daily", 
        start_date, 
        end_date, 
        department, 
        student_id 
      } = requestData;

      // Validate required parameters
      if (!start_date) {
        return new Response(
          JSON.stringify({ error: "start_date is required" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      // Get current user's role from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (profileError) {
        return new Response(
          JSON.stringify({ error: "User profile not found" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }

      const userRole = profileData.role;

      // Check if user has permission to generate reports
      if (!["tutor", "nursing_head", "hospital_admin", "principal"].includes(userRole)) {
        return new Response(
          JSON.stringify({ error: "Unauthorized to generate attendance reports" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
        );
      }

      // Build the base query
      let query = supabase
        .from("attendance_records")
        .select("*")
        .gte("date", start_date);

      // Apply end date filter if provided
      if (end_date) {
        query = query.lte("date", end_date);
      }

      // Apply department filter if provided
      if (department) {
        query = query.eq("department", department);
      }

      // Apply student filter if provided
      if (student_id) {
        query = query.eq("student_id", student_id);
      }

      // Execute the query
      const { data: reportData, error: reportError } = await query;

      if (reportError) {
        return new Response(
          JSON.stringify({ error: reportError.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      // Process the data based on report type
      let processedData;
      if (type === "daily") {
        // Group by date
        processedData = groupByDate(reportData);
      } else if (type === "department") {
        // Group by department
        processedData = groupByDepartment(reportData);
      } else if (type === "student") {
        // Group by student
        processedData = groupByStudent(reportData);
      } else {
        // Default raw data
        processedData = reportData;
      }

      return new Response(
        JSON.stringify({
          report_type: type,
          start_date,
          end_date,
          data: processedData
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST attendance-reports/export - Export attendance reports
    if (req.method === "POST") {
      const { format, reportData } = requestData;

      // Validate request body
      if (!format || !reportData) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: format, reportData" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      // Get current user's role from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (profileError) {
        return new Response(
          JSON.stringify({ error: "User profile not found" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }

      const userRole = profileData.role;

      // Check if user has permission to export reports
      if (!["tutor", "nursing_head", "hospital_admin", "principal"].includes(userRole)) {
        return new Response(
          JSON.stringify({ error: "Unauthorized to export attendance reports" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
        );
      }

      // Generate a file name for the report
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `attendance_report_${timestamp}.${format}`;

      // In a real implementation, this would generate the actual file
      // For this example, we'll return a download URL
      
      return new Response(
        JSON.stringify({
          message: "Report generated successfully",
          download_url: `${supabaseUrl}/storage/v1/object/public/reports/${fileName}`,
          file_name: fileName
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not Found" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
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
    if (record.status === "Present") {
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
    if (record.status === "Present") {
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
    if (record.status === "Present") {
      groupedData[studentId].present++;
    } else {
      groupedData[studentId].absent++;
    }
    
    groupedData[studentId].records.push(record);
  });
  
  return Object.values(groupedData);
}
