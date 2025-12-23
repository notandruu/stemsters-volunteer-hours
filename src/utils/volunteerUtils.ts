/**
 * Extracts the number of hours from a string formatted as "(X hours)".
 * @param text - The input text containing hours in parentheses.
 * @returns The extracted number or null if not found.
 */
export function extractHours(text: string | undefined): number | null {
  if (!text) return null;
  const openParen = text.indexOf("(");
  const hoursWord = text.indexOf(" hour");
  
  if (openParen !== -1 && hoursWord !== -1) {
    return parseInt(text.slice(openParen + 1, hoursWord), 10);
  }
  return null;
}

/**
 * Parses CSV data into rows
 * @param data - Raw CSV text data
 * @returns Array of rows
 */
export function parseCSV(data: string): string[] {
  return data.split("\n").filter(row => row.trim() !== "");
}

/**
 * Searches for records that match the name and ID
 * @param rows - The array of CSV rows
 * @param name - The name to search for
 * @param id - The ID to search for
 * @returns Array of matching rows
 */
export function searchRecords(rows: string[], name: string, id: string): string[] {
  const searchText = `${name} ${id}`.trim().toLowerCase();
  
  if (!searchText) return [];
  
  return rows.filter(row => {
    const columns = row.split(",");
    // Search in column index 3 (fourth column)
    return columns[3] && columns[3].toLowerCase().includes(searchText);
  });
}

/**
 * Determines the hour type and amount based on description
 * @param description - Activity description
 * @returns Object with type and hours
 */
export function determineHourType(description: string): { type: string; hours: number } {
  description = description.toLowerCase();
  
  if (description.includes("referral")) {
    return { type: "Volunteer Referral", hours: 0.5 };
  } else if (description.includes("event")) {
    return { type: "Volunteer Event", hours: 2 };
  } else if (description.includes("meeting")) {
    return { type: "Meeting Attendance", hours: 1 };
  } else if (description.includes("instagram") || description.includes("repost")) {
    return { type: "Instagram Repost", hours: 0.5 };
  } else {
    return { type: "Other", hours: extractHours(description) || 0 };
  }
}

/**
 * Formats a date string into a more readable format
 * @param dateStr - Date string from CSV
 * @returns Formatted date string 
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "Unknown Date";
  
  try {
    // Assuming date format is MM/DD/YYYY
    const parts = dateStr.split("/");
    if (parts.length < 3) return dateStr;
    
    const date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

/**
 * Processes volunteer records to get detailed hour breakdown by date and type
 * @param results - Array of CSV rows
 * @returns Processed hour data by date and type, and total hours
 */
export function processHourDetails(results: string[]): {
  byDateAndType: Array<{
    date: string;
    rawDate: string;
    hourDetails: Array<{
      type: string;
      hours: number;
      count: number;
    }>;
  }>;
  totalHours: number;
  annualPvsaHours: number;
} {
  const hoursByDate: Record<string, Record<string, { hours: number; count: number }>> = {};
  let totalHours = 0;
  let annualPvsaHours = 0;
  
  // Get PVSA annual period boundaries
  const { startDate, endDate } = getPvsaAnnualPeriod();
  
  for (const row of results) {
    const columns = row.split(",");
    
    if (columns.length < 8) continue;
    
    // Use column 2 (index 1) for the timestamp/date information
    const dateStr = columns[1]?.trim() || "Unknown Date";
    const description = columns[7]?.trim() || "";
    
    const { type, hours } = determineHourType(description);
    
    if (hours) {
      // Initialize date entry if it doesn't exist
      if (!hoursByDate[dateStr]) hoursByDate[dateStr] = {};
      
      // Initialize type entry if it doesn't exist
      if (!hoursByDate[dateStr][type]) {
        hoursByDate[dateStr][type] = { hours: 0, count: 0 };
      }
      
      // Add hours to the running total for this date and type
      hoursByDate[dateStr][type].hours += hours;
      hoursByDate[dateStr][type].count += 1;
      
      // Add to overall total
      totalHours += hours;
      
      // Check if the date falls within the PVSA annual period
      try {
        const dateParts = dateStr.split("/");
        const rowDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[0]) - 1, parseInt(dateParts[1]));
        
        if (rowDate >= startDate && rowDate <= endDate) {
          annualPvsaHours += hours;
        }
      } catch (e) {
        console.error("Error parsing date:", dateStr, e);
      }
    }
  }
  
  // Convert the nested object into an array sorted by date
  const sortedDates = Object.keys(hoursByDate).sort((a, b) => {
    // Sort dates in descending order (newest first)
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });
  
  const byDateAndType = sortedDates.map(rawDate => {
    const hourDetails = Object.entries(hoursByDate[rawDate]).map(([type, data]) => ({
      type,
      hours: data.hours,
      count: data.count
    })).sort((a, b) => b.hours - a.hours);
    
    return {
      date: formatDate(rawDate),
      rawDate,
      hourDetails
    };
  });
  
  return { byDateAndType, totalHours, annualPvsaHours };
}

/**
 * Calculates total volunteer hours from results
 * @param results - Array of matching CSV rows
 * @returns Total hours as a number
 */
export function calculateTotalHours(results: string[]): number {
  return processHourDetails(results).totalHours;
}

/**
 * Parses a birthdate string in DD/MM/YYYY format
 * @param birthdate - Birthdate in DD/MM/YYYY format
 * @returns Date object or null if invalid
 */
export function parseBirthdate(birthdate: string): Date | null {
  if (!birthdate) return null;
  
  try {
    const parts = birthdate.split("/");
    if (parts.length !== 3) return null;
    
    // Parse as DD/MM/YYYY
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    
    const date = new Date(year, month, day);
    
    // Verify the date is valid by checking if the components match what we set
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
      return null; // Date was invalid (e.g., 31/02/2022)
    }
    
    return date;
  } catch (e) {
    console.error("Error parsing birthdate:", e);
    return null;
  }
}

/**
 * Gets the PVSA annual period (Sep 1 last year to Aug 31 current year)
 * @returns Object with start and end dates
 */
export function getPvsaAnnualPeriod(): { startDate: Date; endDate: Date } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // If current date is before September, use last year's period
  // Otherwise use current year's period
  const startYear = currentMonth < 8 ? currentYear - 1 : currentYear;
  const endYear = startYear + 1;
  
  return {
    startDate: new Date(startYear, 8, 1), // September 1st
    endDate: new Date(endYear, 7, 31)     // August 31st
  };
}

/**
 * Gets the next PVSA application date (September 15th of current or next year)
 * @returns Date object for next application date
 */
export function getNextApplicationDate(): Date {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  
  // If we're past September 15th, use next year
  if (currentMonth > 8 || (currentMonth === 8 && currentDay > 15)) {
    return new Date(currentYear + 1, 8, 15); // September 15th next year
  }
  
  // Otherwise use current year
  return new Date(currentYear, 8, 15); // September 15th this year
}

/**
 * Calculates age on a specific date
 * @param birthdate - User's birthdate
 * @param onDate - Date to calculate age on
 * @returns Age in years
 */
export function calculateAgeOnDate(birthdate: Date, onDate: Date): number {
  let age = onDate.getFullYear() - birthdate.getFullYear();
  
  // Adjust age if birthday hasn't occurred yet this year
  const birthdateMonth = birthdate.getMonth();
  const onDateMonth = onDate.getMonth();
  
  if (onDateMonth < birthdateMonth || 
      (onDateMonth === birthdateMonth && onDate.getDate() < birthdate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Determines PVSA award eligibility based on age and hours
 * @param birthdate - User's birthdate
 * @param hours - Annual PVSA hours
 * @returns Eligibility information
 */
export function determineAwardEligibility(birthdate: Date | null, hours: number): {
  eligible: boolean;
  ageGroup: string | null;
  award: 'Gold' | 'Silver' | 'Bronze' | null;
  reason?: string;
} {
  if (!birthdate) {
    return { eligible: false, ageGroup: null, award: null, reason: "Valid birthdate is required" };
  }
  
  // Next application date is September 15th
  const nextApplicationDate = getNextApplicationDate();
  
  // Check age on 6 months before the application date
  const sixMonthsBeforeApplication = new Date(nextApplicationDate);
  sixMonthsBeforeApplication.setMonth(sixMonthsBeforeApplication.getMonth() - 6);
  
  const ageOnCutoffDate = calculateAgeOnDate(birthdate, sixMonthsBeforeApplication);
  
  // Determine age group and hour requirements
  let ageGroup: string | null = null;
  let requiredHours = { bronze: 0, silver: 0, gold: 0 };
  
  if (ageOnCutoffDate >= 11 && ageOnCutoffDate <= 15) {
    ageGroup = "Teens (11-15)";
    requiredHours = { bronze: 50, silver: 75, gold: 100 };
  } else if (ageOnCutoffDate >= 16 && ageOnCutoffDate <= 25) {
    ageGroup = "Young Adults (16-25)";
    requiredHours = { bronze: 100, silver: 175, gold: 250 };
  } else {
    return { 
      eligible: false, 
      ageGroup: null, 
      award: null,
      reason: `Age ${ageOnCutoffDate} is outside the eligible age groups (11-25 years)` 
    };
  }
  
  // Determine award level
  let award: 'Gold' | 'Silver' | 'Bronze' | null = null;
  
  if (hours >= requiredHours.gold) {
    award = 'Gold';
  } else if (hours >= requiredHours.silver) {
    award = 'Silver';
  } else if (hours >= requiredHours.bronze) {
    award = 'Bronze';
  }
  
  return {
    eligible: award !== null,
    ageGroup,
    award,
    reason: !award ? `Insufficient volunteer hours (${hours}). Minimum required: ${requiredHours.bronze}` : undefined
  };
}

/**
 * Calculates time remaining until a target date
 * @param targetDate - The date to count down to
 * @returns Remaining time in days, hours, minutes, seconds
 */
export function calculateTimeRemaining(targetDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();
  
  // Calculate time units
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
  return {
    days,
    hours,
    minutes,
    seconds,
    total: difference
  };
}

/**
 * Gets the PVSA application period dates and status
 * @returns Application period information
 */
export function getPvsaApplicationPeriod(): {
  status: 'before' | 'during' | 'after';
  openDate: Date;
  closeDate: Date;
  targetDate: Date;
  message: string;
} {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Application period: September 1-15
  const openDate = new Date(currentYear, 8, 1); // September 1st
  const closeDate = new Date(currentYear, 8, 15); // September 15th
  
  // Determine if we're before, during, or after the application period
  let status: 'before' | 'during' | 'after';
  let targetDate: Date;
  let message: string;
  
  if (now < openDate) {
    status = 'before';
    targetDate = openDate;
    message = "Applications Open In:";
  } else if (now <= closeDate) {
    status = 'during';
    targetDate = closeDate;
    message = "Application Deadline:";
  } else {
    status = 'after';
    // Next year's open date
    targetDate = new Date(currentYear + 1, 8, 1);
    message = "Applications are now closed. See you next year!";
  }
  
  return { status, openDate, closeDate, targetDate, message };
}
