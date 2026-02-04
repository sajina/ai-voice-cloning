import { useState, useEffect } from 'react';
import { adminApi } from '@/api/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Volume2, Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminVoices() {
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVoice, setEditingVoice] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '', description: '', gender: 'male', emotion: 'neutral', language: 'en', is_active: true, is_premium: false,
  });

  useEffect(() => { loadVoices(); }, []);

  const loadVoices = async () => {
    try {
      const data = await adminApi.getVoiceProfiles();
      setVoices(data.results || data || []);
    } catch { toast.error('Failed to load voices'); } finally { setLoading(false); }
  };

  const handleOpenCreate = () => {
    setEditingVoice(null);
    setFormData({ name: '', description: '', gender: 'male', emotion: 'neutral', language: 'en', is_active: true, is_premium: false });
    setDialogOpen(true);
  };

  const handleOpenEdit = (voice) => {
    setEditingVoice(voice);
    setFormData({ name: voice.name, description: voice.description || '', gender: voice.gender, emotion: voice.emotion, language: voice.language, is_active: voice.is_active, is_premium: voice.is_premium });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingVoice) { await adminApi.updateVoiceProfile(editingVoice.id, formData); toast.success('Voice updated'); }
      else { await adminApi.createVoiceProfile(formData); toast.success('Voice created'); }
      setDialogOpen(false); loadVoices();
    } catch { toast.error('Failed to save voice'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this voice?')) return;
    try { await adminApi.deleteVoiceProfile(id); toast.success('Voice deleted'); loadVoices(); } catch { toast.error('Failed to delete'); }
  };

  const filteredVoices = voices.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="text-center py-12"><Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="gradient" onClick={handleOpenCreate}><Plus className="mr-2 h-4 w-4" />Add Voice</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVoices.map((voice) => (
          <Card key={voice.id} className="glass border-white/10">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center"><Volume2 className="w-6 h-6 text-white" /></div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(voice)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(voice.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
              <h3 className="font-semibold mb-1">{voice.name}</h3>
              <p className="text-sm text-muted-foreground capitalize mb-3">{voice.gender} • {voice.emotion}</p>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${voice.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{voice.is_active ? 'Active' : 'Inactive'}</span>
                {voice.is_premium && <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500">Premium</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editingVoice ? 'Edit' : 'Create'} Voice</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
            <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Gender</Label><Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent></Select></div>
              <div><Label>Emotion</Label><Select value={formData.emotion} onValueChange={(v) => setFormData({...formData, emotion: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="neutral">Neutral</SelectItem><SelectItem value="happy">Happy</SelectItem><SelectItem value="sad">Sad</SelectItem><SelectItem value="angry">Angry</SelectItem><SelectItem value="excited">Excited</SelectItem></SelectContent></Select></div>
              <div><Label>Language</Label><Select value={formData.language} onValueChange={(v) => setFormData({...formData, language: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Spanish</SelectItem><SelectItem value="fr">French</SelectItem><SelectItem value="hi">Hindi</SelectItem></SelectContent></Select></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button variant="gradient" onClick={handleSave}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default AdminVoices;
