import { useState } from 'react';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2, Shield, Bell, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export function Settings() {
  const [saving, setSaving] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = async () => {
    if (!passwords.oldPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (!passwords.newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      await authApi.changePassword(passwords.oldPassword, passwords.newPassword);
      toast.success('Password changed successfully!');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const message = error.response?.data?.old_password?.[0] || 
                      error.response?.data?.new_password?.[0] ||
                      'Failed to change password';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your account security and preferences
          </p>
        </div>

        {/* Change Password Card */}
        <Card className="glass border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOldPassword ? 'text' : 'password'}
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters required
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="gradient"
                onClick={handleChangePassword}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Info Card */}
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Preferences
            </CardTitle>
            <CardDescription>
              Notification and display settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              More settings coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
