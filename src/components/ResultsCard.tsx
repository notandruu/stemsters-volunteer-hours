
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { DateGroupedHours } from '@/hooks/useVolunteerHours';
import HoursBreakdownTable from './HoursBreakdownTable';
import dinoFlower from '@/assets/dino-flower.png';

interface ResultsCardProps {
  found: boolean;
  totalHours: number;
  isLoading: boolean;
  hoursByDateAndType?: DateGroupedHours[];
}

const ResultsCard: React.FC<ResultsCardProps> = ({ 
  found, 
  totalHours,
  isLoading,
  hoursByDateAndType = [] 
}) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-md mt-4 glass animate-pulse-subtle">
        <CardContent className="py-8 flex flex-col items-center justify-center min-h-[120px]">
          <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse mb-3"></div>
          <div className="h-7 w-40 bg-muted rounded-md animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (!found) {
    return (
      <Card className="w-full max-w-md mt-4 glass animate-fade-in">
        <CardContent className="py-8 flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-destructive/10 mb-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-destructive mb-1">No Records Found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Please check your name and ID to ensure they match our records exactly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-md mt-4 glass animate-scale-in">
        <CardContent className="py-8 flex flex-col items-center justify-center">
          <img src={dinoFlower} alt="Stemsters mascot" className="h-24 w-24 mb-2 object-contain" />
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-1">{totalHours} Hours</h3>
            <p className="text-sm text-muted-foreground">
              Total Verified Volunteer Hours
            </p>
          </div>
        </CardContent>
      </Card>
      
      {hoursByDateAndType && hoursByDateAndType.length > 0 && (
        <HoursBreakdownTable hoursByDateAndType={hoursByDateAndType} />
      )}
    </>
  );
};

export default ResultsCard;
