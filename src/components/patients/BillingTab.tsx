
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Payment } from '@/store/useAppStore';

interface BillingTabProps {
  totalBalanceDue: number;
  patientPayments: Payment[];
}

const BillingTab: React.FC<BillingTabProps> = ({ totalBalanceDue, patientPayments }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-lg font-semibold">Total Balance Due: ${totalBalanceDue}</p>
            <Button className="mt-4">Record Payment</Button>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-2">Recent Payments</h3>
            {patientPayments.length > 0 ? (
              <ul>
                {patientPayments.map(payment => (
                  <li key={payment.id} className="py-2 border-b">
                    Payment of ${payment.amount} on {new Date(payment.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No payments recorded.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingTab;
