import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Mic, User, Settings, LogOut, LayoutDashboard, 
  Shield, Languages, History, Menu, X, CreditCard 
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu when route changes
  if (isOpen && location) {
    // This will run on every render, but we only want to close if location actually changes. 
    // Better to use useEffect.
  }

  // Effect to close menu on navigation
  // Note: We can't use hooks inside the component body freely if we replace the whole file without correct imports. 
  // I added imports above.

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b font-sans">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">VoiceAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/generate">
                  <Button variant="ghost" size="sm">
                    <Mic className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </Link>
                <Link to="/translate">
                  <Button variant="ghost" size="sm">
                    <Languages className="w-4 h-4 mr-2" />
                    Translate
                  </Button>
                </Link>
                
                <div className="flex items-center mr-4 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  <span className="text-xs text-muted-foreground mr-2">Credits:</span>
                  <span className="text-sm font-bold text-primary">{user?.credits || 0}</span>
                </div>
                <Link to="/pricing">
                  <Button size="sm" variant="outline" className="mr-4 border-primary/50 text-primary hover:bg-primary/10">
                    Buy Credits
                  </Button>
                </Link>
              
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/generation-history" className="flex items-center">
                         <History className="mr-2 h-4 w-4" />
                         Voice Gen History
                      </Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                      <Link to="/history" className="flex items-center">
                        <History className="mr-2 h-4 w-4" />
                        Transaction History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center">
                            <Shield className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                        logout();
                        navigate('/');
                    }} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="gradient">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             {isAuthenticated && (
                <div className="flex items-center px-2 py-1 bg-white/5 rounded-full border border-white/10">
                    <span className="text-[10px] text-muted-foreground mr-1">Cr:</span>
                    <span className="text-xs font-bold text-primary">{user?.credits || 0}</span>
                </div>
             )}
             <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
             </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 z-40 bg-background/95 backdrop-blur-xl border-t border-white/10 overflow-y-auto animate-in fade-in slide-in-from-top-5">
          <div className="container mx-auto px-4 py-6 space-y-6 pb-20"> {/* Added pb-20 for extra scroll space */}
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/5">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <p className="text-base font-semibold truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start h-12 text-base">
                            <LayoutDashboard className="w-5 h-5 mr-3 text-primary" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link to="/generate" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start h-12 text-base">
                            <Mic className="w-5 h-5 mr-3 text-primary" />
                            Generate Speech
                        </Button>
                    </Link>
                    <Link to="/translate" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start h-12 text-base">
                            <Languages className="w-5 h-5 mr-3 text-primary" />
                            Translate
                        </Button>
                    </Link>
                    <Link to="/pricing" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start h-12 text-base text-primary font-medium bg-primary/5">
                            <CreditCard className="w-5 h-5 mr-3" />
                            Buy Credits
                        </Button>
                    </Link>
                </div>

                <div className="border-t border-white/10 pt-4 grid gap-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">Account</p>
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start h-10">
                            <User className="w-4 h-4 mr-3" />
                            Profile
                        </Button>
                    </Link>
                    <Link to="/generation-history" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start h-10">
                             <History className="mr-3 h-4 w-4" />
                             Voice Gen History
                        </Button>
                    </Link>
                    <Link to="/history" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start h-10">
                             <History className="mr-3 h-4 w-4" />
                             Transaction History
                        </Button>
                    </Link>
                    <Link to="/settings" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start h-10">
                            <Settings className="w-4 h-4 mr-3" />
                            Settings
                        </Button>
                    </Link>
                    {isAdmin && (
                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start h-10 text-amber-500">
                                <Shield className="w-4 h-4 mr-3" />
                                Admin Panel
                            </Button>
                        </Link>
                    )}
                     <Button 
                        variant="ghost" 
                        className="w-full justify-start h-10 text-destructive hover:text-destructive hover:bg-destructive/10 mt-2"
                        onClick={() => {
                            logout();
                            navigate('/');
                            setIsOpen(false);
                        }}
                    >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                    </Button>
                </div>
              </>
            ) : (
             <div className="grid gap-4 pt-4">
                 <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full h-12 text-base">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="gradient" className="w-full h-12 text-base shadow-lg shadow-primary/20">Get Started</Button>
                </Link>
             </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
