import { Link } from 'react-router-dom';
import { Mic } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
             <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">VoiceAI</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Advanced AI Voice Generation platform. Turn text into lifelike speech instantly.
              </p>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/generate" className="hover:text-primary transition-colors">Generate Speech</Link></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
                <li><Link to="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
             <h4 className="font-semibold mb-4">Connect</h4>
             <p className="text-sm text-muted-foreground">
                Follow us for updates and new voice additions.
             </p>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>&copy; {currentYear} VoiceAI. All rights reserved.</p>
            <p>Made with ❤️ for Sajin.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
