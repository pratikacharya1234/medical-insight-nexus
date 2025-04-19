
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'english',
    diagnosticThreshold: 'medium',
    sendAnonymousData: true,
    enableAlerts: true,
    confidentialMode: false,
    autoSaveResults: true,
    enableBetaFeatures: false,
    showConfidenceScores: true,
    dataRetentionPeriod: '90days'
  });

  const handleSwitchChange = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const handleReset = () => {
    toast.info("Settings reset to defaults");
    // Reset settings to defaults
    setSettings({
      theme: 'light',
      language: 'english',
      diagnosticThreshold: 'medium',
      sendAnonymousData: true,
      enableAlerts: true,
      confidentialMode: false,
      autoSaveResults: true,
      enableBetaFeatures: false,
      showConfidenceScores: true,
      dataRetentionPeriod: '90days'
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure application preferences and system settings
          </p>
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="diagnostic">Diagnostic</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => handleSelectChange('theme', value)}
                  >
                    <SelectTrigger id="theme" className="w-full md:w-[240px]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleSelectChange('language', value)}
                  >
                    <SelectTrigger id="language" className="w-full md:w-[240px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="confidence-scores"
                    checked={settings.showConfidenceScores}
                    onCheckedChange={() => handleSwitchChange('showConfidenceScores')}
                  />
                  <Label htmlFor="confidence-scores">
                    Show confidence scores in results
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="diagnostic">
            <Card>
              <CardHeader>
                <CardTitle>Diagnostic Settings</CardTitle>
                <CardDescription>Configure AI analysis parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="threshold">Diagnostic Threshold</Label>
                  <Select
                    value={settings.diagnosticThreshold}
                    onValueChange={(value) => handleSelectChange('diagnosticThreshold', value)}
                  >
                    <SelectTrigger id="threshold" className="w-full md:w-[240px]">
                      <SelectValue placeholder="Select threshold" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (More sensitive)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="high">High (More specific)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    Lower thresholds may generate more potential matches with lower confidence.
                    Higher thresholds will show fewer results but with higher confidence.
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="beta-features"
                    checked={settings.enableBetaFeatures}
                    onCheckedChange={() => handleSwitchChange('enableBetaFeatures')}
                  />
                  <Label htmlFor="beta-features">
                    Enable beta diagnostic features
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-save"
                    checked={settings.autoSaveResults}
                    onCheckedChange={() => handleSwitchChange('autoSaveResults')}
                  />
                  <Label htmlFor="auto-save">
                    Automatically save diagnostic results
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage data privacy and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="send-anonymous-data"
                    checked={settings.sendAnonymousData}
                    onCheckedChange={() => handleSwitchChange('sendAnonymousData')}
                  />
                  <div>
                    <Label htmlFor="send-anonymous-data">
                      Send anonymous usage data
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Help us improve by sending anonymous diagnostic performance data
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="confidential-mode"
                    checked={settings.confidentialMode}
                    onCheckedChange={() => handleSwitchChange('confidentialMode')}
                  />
                  <div>
                    <Label htmlFor="confidential-mode">
                      Confidential mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Hide sensitive patient data in screenshots and when sharing results
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention Period</Label>
                  <Select
                    value={settings.dataRetentionPeriod}
                    onValueChange={(value) => handleSelectChange('dataRetentionPeriod', value)}
                  >
                    <SelectTrigger id="data-retention" className="w-full md:w-[240px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="90days">90 Days</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="forever">Never Delete</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    Automatically delete cached diagnostic data after this period
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system notifications and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-alerts"
                    checked={settings.enableAlerts}
                    onCheckedChange={() => handleSwitchChange('enableAlerts')}
                  />
                  <div>
                    <Label htmlFor="enable-alerts">
                      Enable system alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts about system updates and maintenance
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">System Information</h3>
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Version</span>
                      <span>2.5.1</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Release Date</span>
                      <span>April 15, 2025</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">API Version</span>
                      <span>Gemini 2.0 (Feb 2025)</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">License Status</span>
                      <span className="text-green-600">Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="outline">Check for Updates</Button>
                  <Button variant="outline" className="text-destructive">Reset to Defaults</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={handleReset}>Reset All Settings</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
