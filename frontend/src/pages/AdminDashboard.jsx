import { useState, useEffect } from 'react';
import { adminApi } from '@/api/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Volume2, Sparkles, FileAudio, 
  TrendingUp, Shield, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminUsers } from './admin/AdminUsers';
import { AdminVoices } from './admin/AdminVoices';
import { AdminClones } from './admin/AdminClones';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [dashboardStats, userStats] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getUserStats(),
      ]);
      setStats({ ...dashboardStats, users: userStats });
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users?.total_users || 0,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Voice Profiles',
      value: stats?.voice_profiles?.total || 0,
      icon: Volume2,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      title: 'Voice Clones',
      value: stats?.voice_clones?.total || 0,
      icon: Sparkles,
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Total Generations',
      value: stats?.generated_speeches?.total || 0,
      icon: FileAudio,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, voices, and system settings</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="voices">
              <Volume2 className="w-4 h-4 mr-2" />
              Voices
            </TabsTrigger>
            <TabsTrigger value="clones">
              <Sparkles className="w-4 h-4 mr-2" />
              Clones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {statCards.map((stat) => (
                    <Card key={stat.title} className="glass border-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle>Generation Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">This Week</span>
                          <span className="font-semibold">{stats?.generated_speeches?.this_week || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">This Month</span>
                          <span className="font-semibold">{stats?.generated_speeches?.this_month || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total</span>
                          <span className="font-semibold">{stats?.generated_speeches?.total || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle>Voice Clone Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pending</span>
                          <span className="font-semibold text-yellow-500">{stats?.voice_clones?.pending || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ready</span>
                          <span className="font-semibold text-green-500">{stats?.voice_clones?.ready || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total</span>
                          <span className="font-semibold">{stats?.voice_clones?.total || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Voices */}
                {stats?.top_voices?.length > 0 && (
                  <Card className="glass border-white/10 mt-6">
                    <CardHeader>
                      <CardTitle>Most Used Voices</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.top_voices.map((voice, index) => (
                          <div key={voice.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs text-white font-bold">
                                {index + 1}
                              </span>
                              <div>
                                <p className="font-medium">{voice.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {voice.gender} • {voice.emotion}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="voices">
            <AdminVoices />
          </TabsContent>

          <TabsContent value="clones">
            <AdminClones />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminDashboard;
