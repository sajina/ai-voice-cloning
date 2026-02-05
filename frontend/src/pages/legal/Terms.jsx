import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export function Terms() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Terms and Conditions</h1>
        
        <Card className="glass border-white/10">
          <CardContent className="p-8 prose prose-invert max-w-none">
            <h3>1. Introduction</h3>
            <p>Welcome to VoiceAI. By accessing our website and using our AI voice generation services, you agree to bound by these Terms and Conditions.</p>

            <h3>2. User Accounts</h3>
            <p>To access certain features, you must create an account. You represent and warrant that all information you provide is accurate and complete.</p>

            <h3>3. Usage Rights</h3>
            <p>You retain rights to the content you generate, subject to our usage guidelines. You may not use our service to generate content that is illegal, defamatory, or infringes on the rights of others.</p>

            <h3>4. Credits and Payments</h3>
            <p>Our service operates on a credit-based system. Credits are purchased in advance and are non-refundable except as provided in our Refund Policy.</p>

            <h3>5. Termination</h3>
            <p>We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

            <h3>6. Changes to Terms</h3>
            <p>We reserve the right to modify these terms at any time. Your continued use of the service following any changes indicates your acceptance of the new terms.</p>
            
            <p className="text-sm text-muted-foreground mt-8">Last updated: {new Date().toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Terms;
