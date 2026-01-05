
import { useState, useEffect } from 'react';
import { parseCSV, searchRecords, calculateTotalHours, processHourDetails } from '../utils/volunteerUtils';
import { toast } from '@/components/ui/use-toast';

// Google Sheets CSV URL (live data)
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSd3Y8LLTPnQMRCWs2X7q2Jddy_aDwZNe0wMtZ5hLZm3gi5qcHqP398yRRzNxDG1V1VQDdjCtVl5ynN/pub?gid=207004733&single=true&output=csv';

export interface HourDetail {
  type: string;
  hours: number;
  count: number;
}

export interface DateGroupedHours {
  date: string;
  rawDate: string;
  hourDetails: HourDetail[];
}

interface SearchResult {
  found: boolean;
  totalHours: number;
  hoursByDateAndType: DateGroupedHours[];
  isLoading: boolean;
}

export function useVolunteerHours() {
  const [rows, setRows] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  // Fetch data when component mounts
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        const parsedRows = parseCSV(data);
        setRows(parsedRows);
        console.log("Data loaded successfully, found", parsedRows.length, "rows");
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error loading data",
          description: "Could not load volunteer hours data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Search function
  const searchHours = (name: string, id: string, highSchool: string) => {
    if (!name && !id) {
      toast({
        title: "Missing information",
        description: "Please enter at least your name or ID number.",
        variant: "destructive",
      });
      return;
    }

    if (rows.length === 0) {
      toast({
        description: "Data is still loading. Please try again in a moment.",
      });
      return;
    }

    setSearchResult({ 
      found: false, 
      totalHours: 0,
      hoursByDateAndType: [],
      isLoading: true 
    });
    
    // Simulate a short delay for better UX
    setTimeout(() => {
      const results = searchRecords(rows, name, id);
      const { byDateAndType, totalHours } = processHourDetails(results);
      
      setSearchResult({
        found: results.length > 0,
        totalHours,
        hoursByDateAndType: byDateAndType,
        isLoading: false
      });
      
      if (results.length === 0) {
        toast({
          title: "No records found",
          description: "Please check your name and ID and try again.",
          variant: "destructive",
        });
      }
    }, 800);
  };

  return {
    isLoading,
    searchHours,
    searchResult,
    dataReady: rows.length > 0
  };
}
