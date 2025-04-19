
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, FileImage, Clock, User, Bell, Plus, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  pendingAnalysis: number;
  totalPatients: number;
  completedDiagnostics: number;
  averageAnalysisTime: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    pendingAnalysis: 0,
    totalPatients: 0,
    completedDiagnostics: 0,
    averageAnalysisTime: '-'
  });
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [savedCases, setSavedCases] = useState<any[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const analyses = JSON.parse(localStorage.getItem('analyses') || '[]');
    const completedAnalyses = analyses.filter((a: any) => a.status === 'completed');
    const pendingAnalyses = analyses.filter((a: any) => a.status === 'pending');
    
    // Update stats
    setStats({
      pendingAnalysis: pendingAnalyses.length,
      totalPatients: patients.length,
      completedDiagnostics: completedAnalyses.length,
      averageAnalysisTime: completedAnalyses.length > 0 ? '3.2 min' : '-'
    });

    // Set recent results
    setRecentResults(completedAnalyses);
    
    // Set notifications from localStorage
    const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(savedNotifications);
    
    // Set saved cases from localStorage
    const saved = JSON.parse(localStorage.getItem('savedCases') || '[]');
    setSavedCases(saved);
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your medical dashboard
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => navigate('/patients')}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Patients</span>
            </Button>
            <Button
              className="bg-medical-primary hover:bg-medical-primary/90"
              onClick={() => navigate('/diagnostics')}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>New Analysis</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Analysis
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingAnalysis}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingAnalysis === 0 ? 'No pending analysis' : `${stats.pendingAnalysis} pending analyses`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalPatients === 0 ? 'No patients yet' : `${stats.totalPatients} patients in database`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Diagnostics
              </CardTitle>
              <FileImage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedDiagnostics}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedDiagnostics === 0 ? 'No completed diagnostics' : `${stats.completedDiagnostics} diagnostics completed`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Analysis Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageAnalysisTime}</div>
              <p className="text-xs text-muted-foreground">
                {stats.averageAnalysisTime === '-' ? 'No analysis performed' : 'Average processing time'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent">Recent Results</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="saved">Saved Cases</TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Diagnostic Results</CardTitle>
                <CardDescription>
                  Your completed analyses will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No diagnostic results available yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentResults.map((result, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-md">
                        <div>
                          <p className="font-medium">{result.patientId}</p>
                          <p className="text-sm text-muted-foreground">{result.date}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/results/${result.id}`)}>
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Stay updated with system alerts and patient updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No notifications yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-md">
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Saved Cases</CardTitle>
                <CardDescription>
                  Quick access to cases you've marked for reference
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedCases.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No saved cases yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedCases.map((savedCase, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-md">
                        <div>
                          <p className="font-medium">{savedCase.patientId}</p>
                          <p className="text-sm text-muted-foreground">{savedCase.diagnosis}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/results/${savedCase.id}`)}>
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
