import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import paymentsApi from '@/api/payments';
import { Input } from '@/components/ui/input';

export function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await paymentsApi.getAllTransactions();
      setTransactions(data.results || data);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this payment and add credits?')) return;
    try {
      await paymentsApi.approveTransaction(id);
      toast.success('Approved');
      loadTransactions();
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this payment?')) return;
    try {
      await paymentsApi.rejectTransaction(id);
      toast.success('Rejected');
      loadTransactions();
    } catch (error) {
      toast.error('Failed to reject');
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transaction or email..."
            className="pl-8 bg-background/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="glass border-white/10">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Credits</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">UTR</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Proof</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr>
                        <td colSpan="7" className="p-8 text-center text-muted-foreground">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                            Loading...
                        </td>
                    </tr>
                ) : filteredTransactions.length === 0 ? (
                    <tr>
                        <td colSpan="7" className="p-8 text-center text-muted-foreground">
                            No transactions found
                        </td>
                    </tr>
                ) : (
                    filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-4">{tx.user_email}</td>
                            <td className="p-4 font-mono">₹{tx.amount}</td>
                            <td className="p-4 font-mono text-primary">+{tx.credits}</td>
                            <td className="p-4 font-mono text-xs">{tx.transaction_id}</td>
                            <td className="p-4">
                                {tx.screenshot ? (
                                    <a href={tx.screenshot} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">
                                        View
                                    </a>
                                ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                )}
                            </td>
                            <td className="p-4">
                                <Badge variant={
                                    tx.status === 'approved' ? 'default' : 
                                    tx.status === 'rejected' ? 'destructive' : 'secondary'
                                }>
                                    {tx.status}
                                </Badge>
                            </td>
                            <td className="p-4 text-xs text-muted-foreground">
                                {new Date(tx.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right">
                                {tx.status === 'pending' && (
                                    <div className="flex justify-end gap-2">
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/20"
                                            onClick={() => handleApprove(tx.id)}
                                            title="Approve"
                                        >
                                            <Check className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/20"
                                            onClick={() => handleReject(tx.id)}
                                            title="Reject"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminTransactions;
