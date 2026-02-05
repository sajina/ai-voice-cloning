import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VoiceClone() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Voice Cloning</span>
          </h1>
          <p className="text-muted-foreground">
            Create custom voice clones from your own audio samples
          </p>
        </div>

        <Card className="glass border-white/10 py-16">
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-white/10 shadow-2xl shadow-indigo-500/10">
                <Sparkles className="w-12 h-12 text-primary animate-pulse" />
              </div>
              
              <div className="max-w-md space-y-4">
                <h3 className="text-2xl font-bold">Coming Soon</h3>
                <p className="text-muted-foreground text-lg">
                  We are building a state-of-the-art voice cloning engine. 
                  Soon you'll be able to clone any voice with just a few seconds of audio!
                </p>
              </div>

              <div className="pt-4">
                <Button variant="outline" asChild>
                  <Link to="/generate">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Generation
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default VoiceClone;
