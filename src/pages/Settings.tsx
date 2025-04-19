
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ApiKeyForm from '@/components/settings/ApiKeyForm';

const Settings = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application settings
          </p>
        </div>
        <div className="max-w-lg">
          <ApiKeyForm />
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
