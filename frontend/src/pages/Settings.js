import React from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6" data-testid="settings-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>

      {/* User Profile */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">User Profile</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
            <User className="h-10 w-10 text-primary" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
            <Mail className="h-10 w-10 text-primary" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Email Address</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
            <Shield className="h-10 w-10 text-primary" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium">{user?.role}</p>
            </div>
          </div>

          {user?.employee_id && (
            <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
              <Calendar className="h-10 w-10 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-mono font-medium">{user.employee_id}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* System Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">System Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Application Version</span>
            <span className="font-mono font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Theme</span>
            <span className="font-medium">Glass HQ Professional</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Login</span>
            <span className="font-mono text-xs">{new Date().toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};