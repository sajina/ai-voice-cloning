import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, History, Play, Pause, ArrowLeft } from 'lucide-react';
import api from '@/api/axios';
import { useNavigate } from 'react-router-dom';

export function GenerationHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const audioRefs = {};

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
      try {
          setLoading(true);
          const response = await api.get('/api/voices/history/');
          // Handle pagination
          const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
          setHistory(data);
      } catch (error) {
          console.error("Failed to load history:", error);
      } finally {
          setLoading(false);
      }
  };

  const togglePlay = (id, url) => {
    // Determine the full URL
    const fullUrl = url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`;
    
    // If playing this one, pause it
    if (playingId === id) {
        audioRefs[id]?.pause();
        setPlayingId(null);
        return;
    }

    // Stop current playing
    if (playingId && audioRefs[playingId]) {
        audioRefs[playingId].pause();
        audioRefs[playingId].currentTime = 0;
    }

    // Initialize audio if needed
    if (!audioRefs[id]) {
        audioRefs[id] = new Audio(fullUrl);
        audioRefs[id].onended = () => setPlayingId(null);
    }

    audioRefs[id].play();
    setPlayingId(id);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
                <h1 className="text-3xl font-bold">Voice Generation History</h1>
                <p className="text-muted-foreground">View your past generations and costs</p>
            </div>
        </div>

        <Card className="glass border-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Generations
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No history found. Start generating!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-muted-foreground border-b border-white/10">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Voice</th>
                                    <th className="px-4 py-3 w-1/3">Text</th>
                                    <th className="px-4 py-3">Audio</th>
                                    <th className="px-4 py-3">Cost</th>
                                    <th className="px-4 py-3 text-right">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {new Date(item.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.voice_profile_name || item.voice_clone_name || 'Unknown'}
                                            {item.voice_clone_name && <Badge variant="secondary" className="ml-2 text-[10px]">Clone</Badge>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="truncate max-w-[200px]" title={item.input_text}>
                                                {item.input_text}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => togglePlay(item.id, item.audio_file)}
                                                className={playingId === item.id ? "text-primary" : ""}
                                            >
                                                {playingId === item.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                            </Button>
                                        </td>
                                        <td className="px-4 py-3 text-red-400">
                                            -{item.credits_used || 5} Credits
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-green-400">
                                            {item.balance_after !== null ? item.balance_after : '-'}
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

export default GenerationHistory;
