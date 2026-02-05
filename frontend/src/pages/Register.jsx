import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Loader2, Check, ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const benefits = [
  'Generate unlimited voice samples',
  'Clone your own voice',
  'Access to 7+ languages',
  'Priority support',
];

export function Register() {
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirm: '',
    agreed: false,
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirm) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      await authApi.sendOTP(formData);
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      const errors = error.response?.data;
      if (errors) {
        if (typeof errors === 'object') {
          Object.values(errors).forEach((messages) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg) => toast.error(msg));
            } else {
              toast.error(messages);
            }
          });
        } else {
          toast.error(errors);
        }
      } else {
        toast.error('Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }
    
    setLoading(true);

    try {
      await authApi.verifyOTP(formData.email, otp);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Verification failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await authApi.sendOTP(formData);
      toast.success('New OTP sent!');
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-background to-background -z-10" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10" />
      
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Benefits */}
        <div className="hidden md:block">
          <h2 className="text-3xl font-bold mb-6">
            Start creating <span className="gradient-text">amazing voices</span> today
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of creators using VoiceAI to bring their content to life.
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Form */}
        <Card className="glass border-white/10">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
              {step === 1 ? (
                <Mic className="w-8 h-8 text-white" />
              ) : (
                <Mail className="w-8 h-8 text-white" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {step === 1 ? 'Create Account' : 'Verify Email'}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? 'Get started with VoiceAI for free' 
                : `Enter the 6-digit code sent to ${formData.email}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_confirm">Confirm Password</Label>
                  <Input
                    id="password_confirm"
                    name="password_confirm"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="flex items-start space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreed}
                    onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-background/50 text-primary focus:ring-primary accent-primary"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-snug font-normal">
                    I agree to the <Link to="/terms" className="text-primary hover:underline" target="_blank">Terms & Conditions</Link> and <Link to="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full" variant="gradient" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="bg-background/50 text-center text-2xl tracking-widest"
                  />
                </div>
                <Button type="submit" className="w-full" variant="gradient" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-primary hover:underline"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            )}
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Register;
