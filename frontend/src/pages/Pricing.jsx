import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, QrCode, CheckCircle2, Copy, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import paymentsApi from '@/api/payments';
import { useNavigate } from 'react-router-dom';

export function Pricing() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('100');
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const fileInputRef = useRef(null);
  
  // Dynamic Settings
  const [upiId, setUpiId] = useState('sajin.602@oksbi');
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setSettingsLoading(true);
      const data = await paymentsApi.getSettings();
      if (data.upi_id) setUpiId(data.upi_id);
      if (data.qr_code) setQrCode(data.qr_code);
    } catch (error) {
      console.error('Failed to load payment settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!utr) {
      toast.error('Please enter the UPI Reference ID');
      return;
    }

    if (!/^\d{12}$/.test(utr)) {
      toast.error('UTR must be exactly 12 digits');
      return;
    }

    if (!screenshot) {
      toast.error('Please upload a payment screenshot');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('transaction_id', utr);
      if (screenshot) {
        formData.append('screenshot', screenshot);
      }

      await paymentsApi.submitPayment(formData);
      toast.success('Payment submitted! Credits will be added after verification.');
      
      // Navigate to history page to see status
      navigate('/history');
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to submit payment');
      setLoading(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    toast.success('UPI ID copied!');
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Pricing & Credits</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Pay as you go. 1 Credit = ₹1.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Pricing Info */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Credit Packages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { amount: '100', credits: '100', popular: false },
                  { amount: '500', credits: '500', popular: true },
                  { amount: '1000', credits: '1000', popular: false },
                ].map((plan) => (
                  <div 
                    key={plan.amount}
                    onClick={() => setAmount(plan.amount)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                      amount === plan.amount 
                        ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-lg">₹{plan.amount}</p>
                      <p className="text-sm text-muted-foreground">{plan.credits} Credits</p>
                    </div>
                    {plan.popular && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Voice Generation Cost
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Standard & Premium Voices: 5 Credits / request
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Unlimited Downloads
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="glass border-white/10 relative overflow-hidden">
             
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Pay via UPI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center p-4 bg-white rounded-xl mx-auto w-fit">
                 {/* QR Code Container */}
                 <div className="w-48 h-48 bg-white flex items-center justify-center rounded-lg text-black font-mono text-xs text-center border-4 border-black overflow-hidden relative">
                   {settingsLoading ? (
                     <Loader2 className="w-8 h-8 animate-spin text-black" />
                   ) : qrCode ? (
                     <img 
                      src={qrCode.startsWith('http') ? qrCode : `http://127.0.0.1:8000${qrCode}`} 
                      alt="Payment QR" 
                      className="w-full h-full object-contain" 
                     />
                   ) : (
                     <div className="p-2">
                        <p className="font-bold text-lg">SCAN ME</p>
                        <p className="text-[10px] mt-1 break-all">{upiId}</p>
                     </div>
                   )}
                 </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono">{upiId}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyUpiId}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Selected Amount</Label>
                  <Input value={`₹${amount}`} disabled className="bg-background/50" />
                </div>
                
                <div className="space-y-2">
                  <Label>UPI Reference ID (UTR)</Label>
                  <Input 
                    placeholder="Enter 12-digit UTR number" 
                    value={utr}
                    onChange={(e) => setUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    required
                    minLength={12}
                    maxLength={12}
                    className="bg-background/50 font-mono"
                  />
                  <p className="text-xs text-muted-foreground flex justify-between">
                    <span>Must be exactly 12 digits</span>
                    <span>{utr.length}/12</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Payment Screenshot (Mandatory)</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    After payment, upload screenshot. Plan will be activated within 24 hours.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full justify-start text-muted-foreground"
                    >
                        {screenshot ? (
                            <>
                                <ImageIcon className="w-4 h-4 mr-2" />
                                {screenshot.name.substring(0, 20)}...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Screenshot
                            </>
                        )}
                    </Button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" variant="gradient" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Payment'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
