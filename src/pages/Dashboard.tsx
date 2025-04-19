
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, FileImage, Clock, User, Bell, Plus, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, Dr. Lee. You have 3 pending analysis results.
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
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                +2 since yesterday
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
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                +5 this month
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
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">
                +19 this month
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
              <div className="text-2xl font-bold">2.3m</div>
              <p className="text-xs text-muted-foreground">
                -14s from last week
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
                  Your most recent completed analyses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-4">
                  {['Lobar Pneumonia', 'Diabetic Retinopathy', 'Cardiomegaly', 'Skin Melanoma', 'Appendicitis'].map((diagnosis, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-muted cursor-pointer"
                      onClick={() => navigate('/results')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          i % 2 === 0 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          <FileImage className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{diagnosis}</p>
                          <p className="text-sm text-muted-foreground">
                            Patient #{10000 + i} • Analyzed {i === 0 ? 'Today' : `${i} days ago`}
                          </p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        i === 0 ? 'bg-green-100 text-green-800' : 
                        i === 1 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {i === 0 ? '92% Match' : i === 1 ? '76% Match' : '88% Match'}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" onClick={() => navigate('/results')}>
                    View All Results
                  </Button>
                </div>
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
              <CardContent className="space-y-4">
                {['New analysis results available for Patient #10234', 
                  'System maintenance scheduled for tonight at 2 AM',
                  'Patient #10124 test results uploaded',
                  'New feature: Multi-image comparison is now available',
                  'Your saved analysis for Patient #9876 was accessed'].map((notification, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-md hover:bg-muted cursor-pointer">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      i % 3 === 0 ? 'bg-blue-100 text-blue-800' : 
                      i % 3 === 1 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{notification}</p>
                      <p className="text-sm text-muted-foreground">
                        {i === 0 ? '23 minutes ago' : 
                         i === 1 ? '2 hours ago' : 
                         i === 2 ? 'Yesterday at 4:30 PM' : 
                         `${i} days ago`}
                      </p>
                    </div>
                  </div>
                ))}
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
                {['Interesting case of atypical pneumonia', 
                  'Rare presentation of meningitis', 
                  'Complex cardiac case for teaching'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-md hover:bg-muted cursor-pointer mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                        <Star className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{item}</p>
                        <p className="text-sm text-muted-foreground">
                          Saved on April {10 + i}, 2025
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    </Button>
                  </div>
                ))}
                {[1, 2].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-md hover:bg-muted cursor-pointer mb-2 opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                        <Star className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Case template {i + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          Create new saved case
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
