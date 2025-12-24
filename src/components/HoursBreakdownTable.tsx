import React from 'react';
import { DateGroupedHours } from '@/hooks/useVolunteerHours';
import calendarIcon from '@/assets/calendar-icon.png';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import beakerFull1 from '@/assets/beaker-full-1.png';
import beakerFull2 from '@/assets/beaker-full-2.png';
import sproutIcon from '@/assets/sprout.png';
import flowersIcon from '@/assets/flowers.png';

interface HoursBreakdownTableProps {
  hoursByDateAndType: DateGroupedHours[];
}

// Function to get the appropriate badge color based on hour type
const getTypeColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'volunteer event':
      return 'bg-sky-600 hover:bg-sky-700';
    case 'volunteer referral':
      return 'bg-emerald-600 hover:bg-emerald-700';
    case 'meeting attendance':
      return 'bg-[#8ddfbd] hover:bg-[#7cd4af]';
    case 'instagram repost':
      return 'bg-rose-500 hover:bg-rose-600';
    default:
      return 'bg-muted-foreground hover:bg-muted-foreground/80';
  }
};

// Function to get a description of the hour type
const getTypeDescription = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'volunteer event':
      return '2 hours per entry';
    case 'volunteer referral':
      return '0.5 hours per entry';
    case 'meeting attendance':
      return '1 hour per entry';
    case 'instagram repost':
      return '0.5 hours per entry';
    default:
      return 'Hours as specified';
  }
};

// Function to get the appropriate icon based on hour type
const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'volunteer event':
      return <img src={beakerFull2} alt="Beaker" className="h-5 w-5 mr-2 object-contain" />;
    case 'volunteer referral':
      return <img src={sproutIcon} alt="Sprout" className="h-5 w-5 mr-2 object-contain" />;
    case 'meeting attendance':
      return <img src={beakerFull1} alt="Beaker" className="h-5 w-5 mr-2 object-contain" />;
    case 'instagram repost':
      return <img src={flowersIcon} alt="Flowers" className="h-5 w-5 mr-2 object-contain" />;
    default:
      return <img src={calendarIcon} alt="Calendar" className="h-3.5 w-3.5 mr-2 object-contain" />;
  }
};
const HoursBreakdownTable: React.FC<HoursBreakdownTableProps> = ({
  hoursByDateAndType
}) => {
  if (hoursByDateAndType.length === 0) {
    return null;
  }
  return <Card className="w-full mt-4 glass animate-fade-in overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Hours Breakdown</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Activity types: Volunteer Event (2 hrs), Meeting Attendance (1 hr), Instagram Repost (0.5 hrs), Volunteer Referral (0.5 hrs)
        </p>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-border/40">
                <TableHead className="w-1/3 sm:w-1/4">Date</TableHead>
                <TableHead className="w-2/3 sm:w-2/4">Activity Type</TableHead>
                <TableHead className="hidden sm:table-cell w-1/4 text-right">Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hoursByDateAndType.flatMap(dateGroup => dateGroup.hourDetails.map((detail, idx) => <TableRow key={`${dateGroup.rawDate}-${detail.type}-${idx}`}>
                    <TableCell className="flex items-center">
                      <img src={calendarIcon} alt="Calendar" className="h-3.5 w-3.5 mr-2 object-contain" />
                      {dateGroup.date}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          {getTypeIcon(detail.type)}
                          <Badge className={`w-fit ${getTypeColor(detail.type)}`}>
                            {detail.type}
                          </Badge>
                          {detail.count > 1 && <span className="ml-2 text-xs text-muted-foreground">
                              ({detail.count}× entries)
                            </span>}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 ml-6">
                          {getTypeDescription(detail.type)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-right font-medium">
                      {detail.hours} hours
                    </TableCell>
                  </TableRow>))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>;
};
export default HoursBreakdownTable;