
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface TreatmentHistoryItem {
  id: number;
  date: string;
  procedure: string;
  dentist: string;
  cost: number;
}

interface TreatmentTabProps {
  treatmentHistory: TreatmentHistoryItem[];
}

const TreatmentTab: React.FC<TreatmentTabProps> = ({ treatmentHistory }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treatment History</CardTitle>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Dentist</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {treatmentHistory.map((treatment) => (
                  <TableRow key={treatment.id}>
                    <TableCell className="font-medium">{treatment.date}</TableCell>
                    <TableCell>{treatment.procedure}</TableCell>
                    <TableCell>{treatment.dentist}</TableCell>
                    <TableCell className="text-right">${treatment.cost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default TreatmentTab;
