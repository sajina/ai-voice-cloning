import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Calendar, Loader2, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function Profile() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '', avatar: null });
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await authApi.getProfile();
      setProfile(data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setSaving(true);
    try {
      await authApi.updateProfile({ name: profile.name });
      toast.success('Profile updated successfully!');
      if (refreshUser) refreshUser();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">My Profile</span>
          </h1>
          <p className="text-muted-foreground">
            View and manage your account information
          </p>
        </div>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src={getAvatarUrl(profile.avatar)} alt={profile.name} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600 text-white text-2xl">
                  {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Display Name
                </Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </Label>
                <Input
                  value={profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  }) : 'N/A'}
                  disabled
                  className="bg-muted/50"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button
                variant="gradient"
                onClick={handleSave}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
