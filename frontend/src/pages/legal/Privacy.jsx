import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export function Privacy() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Privacy Policy</h1>
        
        <Card className="glass border-white/10">
          <CardContent className="p-8 prose prose-invert max-w-none">
            <h3>1. Information We Collect</h3>
            <p>We collect information you provide directly to us, such as when you create an account, make a payment, or generate content using our AI services.</p>
            <ul>
                <li><strong>Account Information:</strong> Name, email address, password.</li>
                <li><strong>Payment Information:</strong> Transaction details (we do not store full credit card numbers).</li>
                <li><strong>Usage Data:</strong> Inputs you provide for voice generation and the generated outputs.</li>
            </ul>

            <h3>2. How We Use Information</h3>
            <p>We use the information we collect to operate, maintain, and improve our services, to process payments, and to communicate with you.</p>

            <h3>3. Data Sharing</h3>
            <p>We do not share your personal information with third parties except as necessary to provide our services (e.g., payment processors) or as required by law.</p>

            <h3>4. Data Security</h3>
            <p>We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure.</p>
            
            <p className="text-sm text-muted-foreground mt-8">Last updated: {new Date().toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Privacy;
