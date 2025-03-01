
// Attendance Management API
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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

    const url = new URL(req.url);
    const path = url.pathname.split("/").filter(Boolean);
    const attendanceId = path[1]; // Will be undefined for collection endpoints

    // GET /attendance - Fetch attendance records with optional filters
    if (req.method === "GET" && !attendanceId) {
      const studentId = url.searchParams.get("student_id");
      const date = url.searchParams.get("date");
      const department = url.searchParams.get("department");
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "10");
      const offset = (page - 1) * limit;

      let query = supabase
        .from("attendance_records")
        .select("*")
        .order("date", { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters if provided
      if (studentId) {
        query = query.eq("student_id", studentId);
      }
      if (date) {
        query = query.eq("date", date);
      }
      if (department) {
        query = query.eq("department", department);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching attendance:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ data, count }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /attendance/:id - Fetch a specific attendance record
    if (req.method === "GET" && attendanceId) {
      const { data, error } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("id", attendanceId)
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /attendance - Create a new attendance record
    if (req.method === "POST" && !attendanceId) {
      const body = await req.json();
      
      // Validate request body
      const requiredFields = ["student_id", "student_name", "date", "status", "department"];
      for (const field of requiredFields) {
        if (!body[field]) {
          return new Response(
            JSON.stringify({ error: `Missing required field: ${field}` }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }
      }

      // Get current user's role from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (profileError || !profileData) {
        return new Response(
          JSON.stringify({ error: "User profile not found" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }

      const userRole = profileData.role;

      // Check if user has permission to mark attendance
      if (!["tutor", "nursing_head", "hospital_admin", "principal"].includes(userRole)) {
        return new Response(
          JSON.stringify({ error: "Unauthorized to mark attendance" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
        );
      }

      // Create attendance record
      const { data, error } = await supabase
        .from("attendance_records")
        .insert({
          student_id: body.student_id,
          student_name: body.student_name,
          date: body.date,
          status: body.status,
          department: body.department,
          marked_by: userData.user.id,
          marker_role: userRole
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating attendance record:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({
          message: "Attendance recorded successfully",
          attendance_id: data.id
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 201 }
      );
    }

    // PUT /attendance/:id - Update an attendance record
    if (req.method === "PUT" && attendanceId) {
      const body = await req.json();
      
      // Get current user's role from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (profileError || !profileData) {
        return new Response(
          JSON.stringify({ error: "User profile not found" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }

      const userRole = profileData.role;

      // Check if user has permission to update attendance
      if (!["tutor", "nursing_head", "hospital_admin", "principal"].includes(userRole)) {
        return new Response(
          JSON.stringify({ error: "Unauthorized to update attendance" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
        );
      }

      // Update attendance record
      const { data, error } = await supabase
        .from("attendance_records")
        .update({
          ...body,
          updated_at: new Date().toISOString()
        })
        .eq("id", attendanceId)
        .select();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ message: "Attendance updated successfully" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // DELETE /attendance/:id - Delete an attendance record
    if (req.method === "DELETE" && attendanceId) {
      // Get current user's role from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (profileError || !profileData) {
        return new Response(
          JSON.stringify({ error: "User profile not found" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }

      const userRole = profileData.role;

      // Check if user has permission to delete attendance (only nursing_head and up)
      if (!["nursing_head", "hospital_admin", "principal"].includes(userRole)) {
        return new Response(
          JSON.stringify({ error: "Unauthorized to delete attendance records" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
        );
      }

      // Delete attendance record
      const { error } = await supabase
        .from("attendance_records")
        .delete()
        .eq("id", attendanceId);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ message: "Attendance record deleted successfully" }),
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
