import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export function Refund() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Refund & Cancellation Policy</h1>
        
        <Card className="glass border-white/10">
          <CardContent className="p-8 prose prose-invert max-w-none">
            <h3>1. Refund Eligibility</h3>
            <p>We strive to ensure satisfaction with our services. However, due to the nature of digital goods and server costs associated with AI generation:</p>
            <ul>
                <li><strong>Credits:</strong> Purchases of credits are generally non-refundable once allocated to your account.</li>
                <li><strong>Failed Generations:</strong> If a technical error on our end causes a generation to fail, credits are automatically refunded to your balance.</li>
            </ul>

            <h3>2. Cancellation</h3>
            <p>You may delete your account at any time. Upon deletion, any remaining credits in your account will be forfeited and cannot be refunded.</p>

            <h3>3. Exceptional Circumstances</h3>
            <p>Refunds for credit purchases may be considered in exceptional circumstances (e.g., duplicate charges) at our sole discretion. Please contact support within 7 days of the transaction.</p>
            
            <p className="text-sm text-muted-foreground mt-8">Last updated: {new Date().toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Refund;
