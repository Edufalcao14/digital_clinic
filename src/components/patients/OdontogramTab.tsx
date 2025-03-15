
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Odontogram from '@/components/dental/Odontogram';

const OdontogramTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Odontogram</CardTitle>
      </CardHeader>
      <CardContent>
        <Odontogram />
      </CardContent>
    </Card>
  );
};

export default OdontogramTab;
