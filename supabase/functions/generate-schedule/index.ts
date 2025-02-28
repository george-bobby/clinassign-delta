
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateScheduleParams {
  year: 'first' | 'second' | 'third' | 'fourth';
  startDate: string;
  endDate: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request params
    const { year, startDate, endDate } = await req.json() as GenerateScheduleParams

    if (!year || !startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return new Response(
        JSON.stringify({ error: 'Invalid date format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (end < start) {
      return new Response(
        JSON.stringify({ error: 'End date must be after start date' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // 1. Get department requirements for the specified year
    const { data: requirements, error: reqError } = await supabase
      .from('department_year_requirements')
      .select('*, departments(*)')
      .eq('year', year)

    if (reqError) {
      throw reqError
    }

    if (!requirements || requirements.length === 0) {
      return new Response(
        JSON.stringify({ error: `No department requirements found for ${year} year students.` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Helper function to check if a date is a third Saturday or Sunday
    const isThirdSaturdayOrSunday = (date: Date): boolean => {
      const day = date.getDay()
      const dayOfMonth = date.getDate()
      
      // Check if it's a Sunday (0)
      if (day === 0) return true
      
      // Check if it's a Saturday (6) and in the 3rd week of the month
      if (day === 6 && dayOfMonth > 14 && dayOfMonth <= 21) return true
      
      return false
    }

    // Function to add days to a date
    const addDays = (date: Date, days: number): Date => {
      const result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    }

    // 2. Calculate total days available for scheduling
    const generatedSlots = []
    let currentDate = new Date(start)
    const availableDays = []

    // Collect all available days (excluding third Saturdays and Sundays)
    while (currentDate <= end) {
      if (!isThirdSaturdayOrSunday(currentDate)) {
        availableDays.push(new Date(currentDate))
      }
      currentDate = addDays(currentDate, 1)
    }

    if (availableDays.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No available days found in the date range.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // 3. Calculate slots per department based on requirements
    for (const requirement of requirements) {
      const departmentId = requirement.department_id
      const requiredHours = requirement.required_hours
      const department = requirement.departments
      
      // Assuming each slot is 6 hours of clinical practice
      const slotsNeeded = Math.ceil(requiredHours / 6)
      
      // Distribute slots evenly across available days
      const slotsPerDayMax = Math.ceil(slotsNeeded / availableDays.length)
      let slotsCreated = 0
      let dayIndex = 0

      while (slotsCreated < slotsNeeded && dayIndex < availableDays.length) {
        const date = availableDays[dayIndex]
        const dateStr = date.toISOString().split('T')[0]
        
        // Create morning slot (8:00 - 14:00)
        if (slotsCreated < slotsNeeded) {
          generatedSlots.push({
            department_id: departmentId,
            date: dateStr,
            start_time: '08:00',
            end_time: '14:00',
            capacity: department.capacity || 10,
            booked_count: 0
          })
          slotsCreated++
        }
        
        // Create afternoon slot (14:00 - 20:00) if needed
        if (slotsCreated < slotsNeeded && slotsPerDayMax > 1) {
          generatedSlots.push({
            department_id: departmentId,
            date: dateStr,
            start_time: '14:00',
            end_time: '20:00',
            capacity: department.capacity || 10,
            booked_count: 0
          })
          slotsCreated++
        }
        
        dayIndex++
      }
    }

    // 4. Save the generated slots to the database
    const { data: insertedSlots, error: insertError } = await supabase
      .from('schedule_slots')
      .insert(generatedSlots)
      .select()

    if (insertError) {
      throw insertError
    }

    return new Response(
      JSON.stringify({ success: true, slots: insertedSlots, count: insertedSlots.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-schedule function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
