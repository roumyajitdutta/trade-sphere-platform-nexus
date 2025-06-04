
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Lock, LogOut, Key, Shield } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';
import { useToast } from '@/hooks/use-toast';

interface SecuritySettings {
  id: string;
  two_factor_enabled: boolean;
}

const AccountSecurity = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSecuritySettings();
    }
  }, [user]);

  const fetchSecuritySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_security_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSecuritySettings(data);
      } else {
        // Create security settings if they don't exist
        await createSecuritySettings();
      }
    } catch (error) {
      console.error('Error fetching security settings:', error);
      toast({
        title: "Error",
        description: "Failed to load security settings",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const createSecuritySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_security_settings')
        .insert({
          user_id: user?.id,
          two_factor_enabled: false,
        })
        .select()
        .single();

      if (error) throw error;
      setSecuritySettings(data);
    } catch (error) {
      console.error('Error creating security settings:', error);
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('user_security_settings')
        .update({ 
          two_factor_enabled: enabled,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setSecuritySettings(prev => prev ? { ...prev, two_factor_enabled: enabled } : null);
      
      toast({
        title: "Success",
        description: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating two-factor setting:', error);
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication setting",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔒 Account Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Display */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Email Address</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Verified
            </div>
          </div>

          {/* Change Password */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-gray-600">Last changed recently</p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => setIsChangePasswordModalOpen(true)}
            >
              Change Password
            </Button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="two-factor"
                checked={securitySettings?.two_factor_enabled || false}
                onCheckedChange={handleTwoFactorToggle}
              />
              <Label htmlFor="two-factor" className="sr-only">
                Enable two-factor authentication
              </Label>
            </div>
          </div>

          {/* Logout */}
          <div className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-red-900">Sign Out</p>
                <p className="text-sm text-red-700">
                  Sign out of your account on this device
                </p>
              </div>
            </div>
            <Button 
              variant="destructive"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </>
  );
};

export default AccountSecurity;
