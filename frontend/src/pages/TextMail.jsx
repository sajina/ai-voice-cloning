import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/axios'; // Corrected import path

export default function TextMail() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Real API call
      await api.post('/api/auth/text-mail/', { email, message });
      
      toast.success('Mail sent successfully!');
      setMessage('');
      setEmail('');
    } catch (error) {
      toast.error('Failed to send mail');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Text Mail</span>
          </h1>
          <p className="text-muted-foreground">
            Send text messages directly via email
          </p>
        </div>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Compose Message
            </CardTitle>
            <CardDescription>
              Enter the recipient's email and your message below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">To Email</label>
                <Input
                  type="email"
                  placeholder="recipient@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/20 border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="min-h-[150px] bg-black/20 border-white/10"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Mail
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
