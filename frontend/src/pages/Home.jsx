import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Mic, Sparkles, Zap, Shield, Globe, Users, 
  Play, ArrowRight, Check, Star
} from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Natural Voice Synthesis',
    description: 'Generate lifelike speech with multiple emotions and speaking styles.',
  },
  {
    icon: Sparkles,
    title: 'Voice Cloning',
    description: 'Clone any voice with just a few minutes of audio sample.',
  },
  {
    icon: Globe,
    title: 'Multi-language Support',
    description: 'Generate speech in 7+ languages with native accents.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get your audio generated in seconds, not minutes.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Your data is encrypted and never shared with third parties.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite team members and manage projects together.',
  },
];

const voiceStyles = [
  { emotion: 'Happy', color: 'from-yellow-500 to-orange-500' },
  { emotion: 'Sad', color: 'from-blue-500 to-indigo-500' },
  { emotion: 'Excited', color: 'from-pink-500 to-rose-500' },
  { emotion: 'Calm', color: 'from-green-500 to-teal-500' },
  { emotion: 'Angry', color: 'from-red-500 to-orange-600' },
];

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">AI-Powered Voice Generation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              <span className="gradient-text">Transform Text</span>
              <br />
              <span className="text-foreground">Into Natural Speech</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
              Create realistic voices with emotions, clone your own voice, and generate 
              speech in multiple languages. Powered by cutting-edge AI technology.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link to="/register">
                <Button size="lg" variant="gradient" className="text-lg px-8 h-12">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="text-lg px-8 h-12">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </Link>
            </div>
            
            {/* Voice Styles Preview */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
              {voiceStyles.map((style) => (
                <div
                  key={style.emotion}
                  className={`px-6 py-3 rounded-full bg-gradient-to-r ${style.color} text-white font-medium hover-lift cursor-pointer`}
                >
                  {style.emotion}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need for <span className="gradient-text">Voice Generation</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features to create, customize, and deploy AI-generated voices at scale.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl glass hover-lift group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden gradient-primary p-12 md:p-16">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-indigo-600/50" />
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Voice Experience?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of creators, developers, and businesses using VoiceAI to 
                generate natural speech at scale.
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 text-lg px-8 h-12">
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">VoiceAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 VoiceAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
