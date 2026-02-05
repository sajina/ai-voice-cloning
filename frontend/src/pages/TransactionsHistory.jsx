import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, History, Eye, ArrowLeft, Shield } from 'lucide-react';
import paymentsApi from '@/api/payments';
import { useNavigate } from 'react-router-dom';

export function TransactionsHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
      try {
          setHistoryLoading(true);
          const data = await paymentsApi.getHistory();
          // Handle pagination { results: [] } or direct array []
          const transactions = Array.isArray(data) ? data : (data.results || []);
          setHistory(transactions);
      } catch (error) {
          console.error("Failed to load history:", error);
      } finally {
          setHistoryLoading(false);
      }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate('/pricing')}>
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
                <h1 className="text-3xl font-bold">Transaction History</h1>
                <p className="text-muted-foreground">View your payment history and verification status</p>
            </div>
        </div>

        <Card className="glass border-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    All Transactions
                </CardTitle>
            </CardHeader>
            <CardContent>
                {historyLoading ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No transactions found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-muted-foreground border-b border-white/10">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">UTR</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Credits</th>
                                    <th className="px-4 py-3">Proof</th>
                                    <th className="px-4 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.map((tx) => (
                                    <tr key={tx.id}>
                                        <td className="px-4 py-3">{new Date(tx.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 font-mono text-muted-foreground">{tx.transaction_id}</td>
                                        <td className="px-4 py-3">₹{tx.amount}</td>
                                        <td className="px-4 py-3 text-primary">+{tx.credits}</td>
                                        <td className="px-4 py-3">
                                            {tx.screenshot ? (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                            <Eye className="w-4 h-4 text-blue-400" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl">
                                                        <DialogHeader>
                                                            <DialogTitle>Payment Proof</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="mt-4 flex justify-center bg-black/5 rounded-lg overflow-hidden">
                                                            <img 
                                                                src={tx.screenshot.startsWith('http') ? tx.screenshot : `http://127.0.0.1:8000${tx.screenshot}`} 
                                                                alt="Payment Proof" 
                                                                className="max-h-[80vh] w-auto object-contain"
                                                            />
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Badge variant={
                                                tx.status === 'approved' ? 'default' : 
                                                tx.status === 'rejected' ? 'destructive' : 'secondary'
                                            }>
                                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TransactionsHistory;
