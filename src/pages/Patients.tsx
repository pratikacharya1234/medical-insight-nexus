
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, Plus, Calendar, FileText, FileImage, User, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PatientStatus = 'active' | 'referred' | 'discharged';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  status: PatientStatus;
  lastVisit: string;
  upcomingAppointment?: string;
}

const Patients = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Real-world implementation would fetch this from an API
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'P-10234',
      name: 'Elizabeth Chen',
      age: 42,
      gender: 'Female',
      condition: 'Suspected pneumonia',
      status: 'active',
      lastVisit: 'April 19, 2025',
      upcomingAppointment: 'April 26, 2025'
    },
    {
      id: 'P-10235',
      name: 'Robert Turner',
      age: 58,
      gender: 'Male',
      condition: 'Post-surgical follow-up',
      status: 'active',
      lastVisit: 'April 18, 2025'
    },
    {
      id: 'P-10124',
      name: 'Maria Garcia',
      age: 35,
      gender: 'Female',
      condition: 'Knee injury evaluation',
      status: 'referred',
      lastVisit: 'April 15, 2025',
      upcomingAppointment: 'April 30, 2025'
    },
    {
      id: 'P-9876',
      name: 'James Wilson',
      age: 65,
      gender: 'Male',
      condition: 'Cardiac monitoring',
      status: 'discharged',
      lastVisit: 'April 10, 2025'
    },
    {
      id: 'P-9854',
      name: 'Sarah Johnson',
      age: 29,
      gender: 'Female',
      condition: 'Headache assessment',
      status: 'active',
      lastVisit: 'April 8, 2025',
      upcomingAppointment: 'May 1, 2025'
    }
  ]);
  
  const getStatusBadge = (status: PatientStatus) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case 'referred':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Referred</Badge>;
      case 'discharged':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Discharged</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleNewPatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real implementation, this would create a new patient record
    // and potentially navigate to their profile or send data to an API
    
    // Close dialog automatically handled by shadcn Dialog component
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
            <p className="text-muted-foreground">
              Manage and view your patient records
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                <span>New Patient</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Enter patient information to create a new record.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNewPatient}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="first-name" className="text-right">
                      First name
                    </Label>
                    <Input id="first-name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="last-name" className="text-right">
                      Last name
                    </Label>
                    <Input id="last-name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dob" className="text-right">
                      Date of Birth
                    </Label>
                    <Input id="dob" type="date" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gender" className="text-right">
                      Gender
                    </Label>
                    <Select>
                      <SelectTrigger id="gender" className="col-span-3">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input id="phone" type="tel" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" type="email" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input id="address" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right" htmlFor="consent">
                      Consent
                    </Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Checkbox id="consent" />
                      <label
                        htmlFor="consent"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Patient has given consent for data processing
                      </label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Patient</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-4">
            <TabsList className="h-10">
              <TabsTrigger value="all" className="px-4">All Patients</TabsTrigger>
              <TabsTrigger value="scheduled" className="px-4">Scheduled</TabsTrigger>
              <TabsTrigger value="recent" className="px-4">Recent</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search patients..." 
                  className="pl-8 w-[200px] md:w-[260px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Filter</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="referred">Referred</SelectItem>
                  <SelectItem value="discharged">Discharged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead className="hidden md:table-cell">Patient ID</TableHead>
                      <TableHead className="hidden md:table-cell">Age/Gender</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No patients found matching your search criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-medical-primary text-white">
                                  {patient.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{patient.name}</p>
                                <p className="text-xs text-muted-foreground md:hidden">
                                  {patient.id} • {patient.age}, {patient.gender}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{patient.id}</TableCell>
                          <TableCell className="hidden md:table-cell">{patient.age}, {patient.gender}</TableCell>
                          <TableCell>{patient.condition}</TableCell>
                          <TableCell>{getStatusBadge(patient.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                title="View Patient Record"
                                onClick={() => navigate(`/patients/${patient.id}`)}
                              >
                                <User className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                title="View Medical Records"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                title="New Diagnostic Analysis"
                                onClick={() => navigate('/diagnostics')}
                              >
                                <FileImage className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredPatients.length} of {patients.length} patients
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" disabled={filteredPatients.length === 0}>Export</Button>
                  <Button size="sm" disabled={filteredPatients.length === 0}>Bulk Action</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="scheduled" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Appointments</CardTitle>
                <CardDescription>Patients with upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients
                    .filter(p => p.upcomingAppointment)
                    .map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="bg-medical-primary/10 p-2 rounded-full">
                            <Calendar className="h-5 w-5 text-medical-primary" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{patient.name}</p>
                              {getStatusBadge(patient.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {patient.upcomingAppointment} • {patient.condition}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('/diagnostics')}>
                          Prepare
                        </Button>
                      </div>
                    ))}
                    
                    {patients.filter(p => p.upcomingAppointment).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No upcoming appointments scheduled.
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Patient Activity</CardTitle>
                <CardDescription>Recent visits and diagnostic analyses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients
                    .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
                    .slice(0, 3)
                    .map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Activity className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Last visit: {patient.lastVisit} • {patient.condition}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('/results')}>
                          View Results
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="border-t">
                <Button variant="outline" className="w-full">View All Activity</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Patients;
