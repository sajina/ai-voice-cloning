import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { voicesApi } from '@/api/voices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Mic, Sparkles, Clock, Volume2, ArrowRight, 
  TrendingUp, FileAudio, Play, Square, Download, Trash2, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalGenerations: 0,
    voiceClones: 0,
    recentHistory: [],
  });
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const audioInstance = useRef(null);

  useEffect(() => {
    loadDashboardData();
    
    // Cleanup audio on unmount
    return () => {
      if (audioInstance.current) {
        audioInstance.current.pause();
      }
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      const [historyRes, clonesRes] = await Promise.all([
        voicesApi.getHistory({ page_size: 5 }),
        voicesApi.getClones(),
      ]);

      setStats({
        totalGenerations: historyRes.count || historyRes.results?.length || 0,
        voiceClones: clonesRes.results?.length || clonesRes.length || 0,
        recentHistory: historyRes.results || historyRes || [],
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getAudioUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  const handlePlayPause = (item) => {
    if (playingId === item.id) {
      // Pause current
      if (audioInstance.current) {
        audioInstance.current.pause();
      }
      setPlayingId(null);
    } else {
      // Play new
      if (audioInstance.current) {
        audioInstance.current.pause();
      }
      
      const url = getAudioUrl(item.audio_file);
      if (!url) {
        toast.error('Audio not available');
        return;
      }

      audioInstance.current = new Audio(url);
      audioInstance.current.onended = () => setPlayingId(null);
      audioInstance.current.play().catch(e => {
         console.error('Play error', e);
         toast.error('Failed to play audio');
      });
      setPlayingId(item.id);
    }
  };

  const handleDownload = async (item) => {
    const url = getAudioUrl(item.audio_file);
    if (!url) {
      toast.error('Audio not available');
      return;
    }

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `voice_${item.id}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download audio');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this generation?')) return;
    
    try {
      await voicesApi.deleteHistory(id);
      toast.success('Deleted successfully');
      // Refresh list
      loadDashboardData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete item');
    }
  };

  const statCards = [
    {
      title: 'Total Generations',
      value: stats.totalGenerations,
      icon: FileAudio,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      title: 'Voice Clones',
      value: stats.voiceClones,
      icon: Sparkles,
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'This Month',
      value: stats.totalGenerations, // Mock for now
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.name || 'User'}</span>
          </h1>
          <p className="text-muted-foreground">
            Ready to create amazing voice content today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to="/generate">
            <Card className="glass border-white/10 hover-lift cursor-pointer group">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Volume2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Generate Speech</h3>
                    <p className="text-sm text-muted-foreground">Create new voice content</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/clone">
            <Card className="glass border-white/10 hover-lift cursor-pointer group">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Clone Voice</h3>
                    <p className="text-sm text-muted-foreground">Create your voice clone</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.title} className="glass border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{loading ? '...' : stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="glass border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Generations
            </CardTitle>
            <Link to="/history">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : stats.recentHistory.length === 0 ? (
              <div className="text-center py-8">
                <Mic className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No generations yet</p>
                <Link to="/generate">
                  <Button variant="gradient">Generate Your First Speech</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                        <FileAudio className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">
                          {item.input_text?.substring(0, 50)}...
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.voice_profile_name || item.voice_clone_name || 'Voice'}
                          {' • '}
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {item.audio_file && (
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handlePlayPause(item)}
                        >
                          {playingId === item.id ? (
                            <Square className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDownload(item)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
