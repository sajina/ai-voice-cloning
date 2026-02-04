import { useState, useEffect } from 'react';
import { adminApi } from '@/api/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-500', label: 'Pending' },
  processing: { icon: Loader2, color: 'text-blue-500', label: 'Processing' },
  ready: { icon: CheckCircle, color: 'text-green-500', label: 'Ready' },
  failed: { icon: XCircle, color: 'text-red-500', label: 'Failed' },
};

export function AdminClones() {
  const [clones, setClones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadClones(); }, []);

  const loadClones = async () => {
    try {
      const data = await adminApi.getVoiceClones();
      setClones(data.results || data || []);
    } catch { toast.error('Failed to load clones'); } finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try { await adminApi.approveVoiceClone(id); toast.success('Clone approved'); loadClones(); } catch { toast.error('Failed'); }
  };

  const handleReject = async (id) => {
    try { await adminApi.rejectVoiceClone(id); toast.success('Clone rejected'); loadClones(); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="text-center py-12"><Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" /></div>;

  return (
    <div className="space-y-3">
      {clones.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No voice clones</div>
      ) : clones.map((clone) => {
        const StatusIcon = statusConfig[clone.status]?.icon || Clock;
        const statusColor = statusConfig[clone.status]?.color || 'text-gray-500';
        return (
          <Card key={clone.id} className="glass border-white/10">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium">{clone.name}</p>
                  <p className="text-sm text-muted-foreground">{clone.user_email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                    <span className={`text-xs ${statusColor}`}>{statusConfig[clone.status]?.label}</span>
                  </div>
                </div>
              </div>
              {clone.status === 'pending' && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleApprove(clone.id)} className="text-green-500">Approve</Button>
                  <Button variant="outline" size="sm" onClick={() => handleReject(clone.id)} className="text-red-500">Reject</Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
export default AdminClones;
