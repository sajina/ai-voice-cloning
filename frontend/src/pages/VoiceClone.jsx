import { useState, useEffect, useRef } from 'react';
import { voicesApi } from '@/api/voices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Sparkles, Upload, Loader2, Trash2, Mic, 
  Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-500', label: 'Pending' },
  processing: { icon: Loader2, color: 'text-blue-500', label: 'Processing' },
  ready: { icon: CheckCircle, color: 'text-green-500', label: 'Ready' },
  failed: { icon: XCircle, color: 'text-red-500', label: 'Failed' },
};

export function VoiceClone() {
  const [clones, setClones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newClone, setNewClone] = useState({
    name: '',
    description: '',
    audioFile: null,
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadClones();
  }, []);

  const loadClones = async () => {
    try {
      const data = await voicesApi.getClones();
      setClones(data.results || data || []);
    } catch (error) {
      toast.error('Failed to load voice clones');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast.error('Please upload an audio file');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      setNewClone({ ...newClone, audioFile: file });
    }
  };

  const handleCreateClone = async () => {
    if (!newClone.name.trim()) {
      toast.error('Please enter a name');
      return;
    }
    if (!newClone.audioFile) {
      toast.error('Please upload an audio sample');
      return;
    }

    setCreating(true);
    try {
      await voicesApi.createClone({
        name: newClone.name,
        description: newClone.description,
        audioSample: newClone.audioFile,
      });
      toast.success('Voice clone created successfully!');
      setDialogOpen(false);
      setNewClone({ name: '', description: '', audioFile: null });
      loadClones();
    } catch (error) {
      toast.error('Failed to create voice clone');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClone = async (id) => {
    if (!confirm('Are you sure you want to delete this voice clone?')) return;

    try {
      await voicesApi.deleteClone(id);
      toast.success('Voice clone deleted');
      loadClones();
    } catch (error) {
      toast.error('Failed to delete voice clone');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text">Voice Cloning</span>
            </h1>
            <p className="text-muted-foreground">
              Create custom voice clones from audio samples
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Sparkles className="mr-2 h-4 w-4" />
                New Clone
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Voice Clone</DialogTitle>
                <DialogDescription>
                  Upload an audio sample to create a new voice clone
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Voice Name</Label>
                  <Input
                    id="name"
                    placeholder="My Voice"
                    value={newClone.name}
                    onChange={(e) => setNewClone({ ...newClone, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe this voice..."
                    value={newClone.description}
                    onChange={(e) => setNewClone({ ...newClone, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Audio Sample</Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    {newClone.audioFile ? (
                      <div>
                        <Mic className="w-8 h-8 mx-auto text-primary mb-2" />
                        <p className="text-sm font-medium">{newClone.audioFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(newClone.audioFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload audio file
                        </p>
                        <p className="text-xs text-muted-foreground">
                          MP3, WAV, M4A (max 50MB)
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1">Tips for best results:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>Use a clear recording with minimal background noise</li>
                        <li>Speak naturally for 1-3 minutes</li>
                        <li>Avoid music or sound effects</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="gradient" onClick={handleCreateClone} disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Clone'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Clones List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
          </div>
        ) : clones.length === 0 ? (
          <Card className="glass border-white/10">
            <CardContent className="text-center py-16">
              <Sparkles className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Voice Clones Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first voice clone by uploading an audio sample. 
                You can then use it to generate speech in your own voice.
              </p>
              <Button variant="gradient" onClick={() => setDialogOpen(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Create Your First Clone
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {clones.map((clone) => {
              const StatusIcon = statusConfig[clone.status]?.icon || Clock;
              const statusColor = statusConfig[clone.status]?.color || 'text-gray-500';
              const statusLabel = statusConfig[clone.status]?.label || clone.status;

              return (
                <Card key={clone.id} className="glass border-white/10">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{clone.name}</h3>
                        {clone.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {clone.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <StatusIcon className={`w-4 h-4 ${statusColor} ${clone.status === 'processing' ? 'animate-spin' : ''}`} />
                          <span className={`text-xs ${statusColor}`}>{statusLabel}</span>
                          <span className="text-xs text-muted-foreground">
                            • Created {new Date(clone.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {clone.status === 'ready' && (
                        <Button variant="outline" asChild>
                          <a href="/generate">Use Voice</a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClone(clone.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceClone;
