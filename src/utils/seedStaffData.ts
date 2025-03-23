
import { supabase } from '@/integrations/supabase/client';

export type SeedStaffMember = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  hourly_rate: number;
  bio: string;
  attendance: string;
  performance: number;
  start_date: string;
};

export const staffSeedData: SeedStaffMember[] = [
  {
    first_name: "Alem",
    last_name: "Tadesse",
    email: "alem.tadesse@email.com",
    phone: "+44 7123 456789",
    role: "Head Chef",
    department: "Kitchen",
    hourly_rate: 15.5,
    bio: "Experienced chef with expertise in authentic Ethiopian cuisine.",
    attendance: "Present",
    performance: 95,
    start_date: "2022-04-15"
  },
  {
    first_name: "Meron",
    last_name: "Haile",
    email: "meron.haile@email.com",
    phone: "+44 7987 654321",
    role: "Server",
    department: "Front of House",
    hourly_rate: 9.0,
    bio: "Friendly server with excellent customer service skills.",
    attendance: "Present",
    performance: 88,
    start_date: "2022-07-22"
  },
  {
    first_name: "Dawit",
    last_name: "Solomon",
    email: "dawit.solomon@email.com",
    phone: "+44 7456 123789",
    role: "Manager",
    department: "Management",
    hourly_rate: 18.5,
    bio: "Experienced restaurant manager with 10+ years in hospitality.",
    attendance: "Present",
    performance: 92,
    start_date: "2021-11-10"
  },
  {
    first_name: "Sara",
    last_name: "Abebe",
    email: "sara.abebe@email.com",
    phone: "+44 7789 456123",
    role: "Bartender",
    department: "Front of House",
    hourly_rate: 11.5,
    bio: "Passionate about crafting unique traditional Ethiopian drinks.",
    attendance: "Late",
    performance: 85,
    start_date: "2023-01-15"
  },
  {
    first_name: "Yonas",
    last_name: "Bekele",
    email: "yonas.bekele@email.com",
    phone: "+44 7321 654987",
    role: "Sous Chef",
    department: "Kitchen",
    hourly_rate: 14.0,
    bio: "Specializes in Eritrean cuisine with modern twists.",
    attendance: "Present",
    performance: 90,
    start_date: "2022-09-05"
  }
];

// Seed staff attendance data
export const seedStaffAttendance = async (staffId: string) => {
  try {
    const today = new Date();
    const attendanceData = [];
    
    // Generate attendance records for the past 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Skip weekends (Saturday and Sunday)
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Randomly determine status (mostly present, occasionally late or absent)
      const random = Math.random();
      let status;
      if (random < 0.8) {
        status = "Present";
      } else if (random < 0.9) {
        status = "Late";
      } else {
        status = "Absent";
      }
      
      // Create check-in and check-out times for present or late status
      let checkIn = null;
      let checkOut = null;
      let hoursWorked = 0;
      
      if (status !== "Absent") {
        // Base time: 9 AM for check-in
        const inHour = 9;
        const inMinute = status === "Late" ? Math.floor(Math.random() * 30) + 15 : Math.floor(Math.random() * 15);
        
        // Base time: 5 PM for check-out
        const outHour = 17;
        const outMinute = Math.floor(Math.random() * 30);
        
        // Create date objects with the appropriate times
        const checkInDate = new Date(date);
        checkInDate.setHours(inHour, inMinute, 0, 0);
        
        const checkOutDate = new Date(date);
        checkOutDate.setHours(outHour, outMinute, 0, 0);
        
        checkIn = checkInDate.toISOString();
        checkOut = checkOutDate.toISOString();
        
        // Calculate hours worked (approximately)
        const diffMs = checkOutDate.getTime() - checkInDate.getTime();
        hoursWorked = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
      }
      
      attendanceData.push({
        staff_id: staffId,
        date: date.toISOString().split('T')[0],
        status,
        check_in: checkIn,
        check_out: checkOut,
        hours_worked: hoursWorked,
        notes: status === "Absent" ? "Called in sick" : 
               status === "Late" ? "Traffic delay" : null
      });
    }
    
    // Insert records in batches to avoid potential size limitations
    const batchSize = 10;
    for (let i = 0; i < attendanceData.length; i += batchSize) {
      const batch = attendanceData.slice(i, i + batchSize);
      const { error } = await supabase.from('staff_attendance').insert(batch);
      
      if (error) {
        console.error("Error inserting attendance batch:", error);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error seeding attendance data:", error);
    return false;
  }
};

// Seed payroll data
export const seedStaffPayroll = async (staffId: string, hourlyRate: number) => {
  try {
    const payrollData = [];
    const months = ["January", "February", "March", "April", "May", "June"];
    
    // Generate payroll records for the last 6 months
    for (let i = 0; i < months.length; i++) {
      const month = months[i];
      const year = 2023;
      
      // Calculate regular hours based on 20 working days per month
      const regularHours = 160; // 8 hours x 20 days
      
      // Some months have overtime
      const overtimeHours = i % 2 === 0 ? Math.floor(Math.random() * 10) + 5 : 0;
      
      // Total hours and pay
      const totalHours = regularHours + overtimeHours;
      const totalPay = (regularHours * hourlyRate) + (overtimeHours * hourlyRate * 1.5);
      
      // Payment status (most recent 2 are pending, others are paid)
      const paymentStatus = i < 2 ? "Pending" : "Paid";
      
      // Payment date (null for pending, a date for paid)
      const paymentDate = paymentStatus === "Paid" ? 
        new Date(year, i, 28).toISOString() : null;
      
      payrollData.push({
        staff_id: staffId,
        pay_period: `${month} ${year}`,
        regular_hours: regularHours,
        overtime_hours: overtimeHours,
        total_hours: totalHours,
        total_pay: totalPay,
        payment_status: paymentStatus,
        payment_date: paymentDate
      });
    }
    
    const { error } = await supabase.from('staff_payroll').insert(payrollData);
    
    if (error) {
      console.error("Error inserting payroll data:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error seeding payroll data:", error);
    return false;
  }
};

// Seed tasks data
export const seedStaffTasks = async (staffId: string) => {
  try {
    const taskData = [];
    const today = new Date();
    
    // Task categories based on department roles
    const taskCategories = {
      "Kitchen": ["Food Prep", "Inventory", "Cleaning", "Menu Development", "Training"],
      "Front of House": ["Customer Service", "Cleaning", "Training", "Inventory", "Setup"],
      "Management": ["Administrative", "Scheduling", "Finance", "Marketing", "Training"]
    };
    
    // Get staff department to assign appropriate categories
    const { data: staffData, error: staffError } = await supabase
      .from('profiles')
      .select('department')
      .eq('id', staffId)
      .single();
      
    if (staffError) {
      console.error("Error fetching staff department:", staffError);
      return false;
    }
    
    const department = staffData?.department || "Kitchen";
    const categories = taskCategories[department as keyof typeof taskCategories] || taskCategories["Kitchen"];
    
    // Generate a mix of pending, in progress, and completed tasks
    for (let i = 0; i < 10; i++) {
      // Calculate due date
      const dueDate = new Date();
      
      // For completed tasks, due date is in the past
      if (i < 3) {
        dueDate.setDate(today.getDate() - Math.floor(Math.random() * 14) - 1);
      } 
      // For pending tasks, due date is in the future
      else if (i < 7) {
        dueDate.setDate(today.getDate() + Math.floor(Math.random() * 14) + 1);
      }
      // For today's tasks
      else {
        dueDate.setDate(today.getDate());
      }
      
      // Decide task status
      let status;
      let completedAt = null;
      
      if (i < 3) {
        status = "Completed";
        // Completed 1-3 days before due date
        const completionDate = new Date(dueDate);
        completionDate.setDate(dueDate.getDate() - Math.floor(Math.random() * 3) - 1);
        completedAt = completionDate.toISOString();
      } else if (i < 5) {
        status = "In Progress";
      } else {
        status = "Pending";
      }
      
      // Random priority
      const priorities = ["High", "Medium", "Low"];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      // Random category
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      taskData.push({
        staff_id: staffId,
        title: `Task ${i + 1}: ${category} task`,
        description: `This is a sample ${category.toLowerCase()} task for testing purposes.`,
        priority,
        status,
        due_date: dueDate.toISOString(),
        completed_at: completedAt,
        category
      });
    }
    
    const { error } = await supabase.from('staff_tasks').insert(taskData);
    
    if (error) {
      console.error("Error inserting task data:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error seeding task data:", error);
    return false;
  }
};

// Function to seed all staff-related data
export const seedAllStaffData = async () => {
  try {
    // Check if we already have staff data
    const { data: existingStaff, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.error("Error checking for existing staff:", checkError);
      return false;
    }
    
    // If we already have staff data, don't reseed
    if (existingStaff && existingStaff.length > 0) {
      console.log("Staff data already exists, not reseeding");
      return true;
    }
    
    // Insert staff profiles
    for (const staff of staffSeedData) {
      const { data: insertedStaff, error: insertError } = await supabase
        .from('profiles')
        .insert([staff])
        .select();
        
      if (insertError) {
        console.error("Error inserting staff:", insertError);
        continue;
      }
      
      if (!insertedStaff || insertedStaff.length === 0) {
        console.error("No staff record returned after insert");
        continue;
      }
      
      const staffId = insertedStaff[0].id;
      
      // Seed attendance data for this staff member
      await seedStaffAttendance(staffId);
      
      // Seed payroll data for this staff member
      await seedStaffPayroll(staffId, staff.hourly_rate);
      
      // Seed tasks data for this staff member
      await seedStaffTasks(staffId);
    }
    
    return true;
  } catch (error) {
    console.error("Error seeding staff data:", error);
    return false;
  }
};

export default seedAllStaffData;
