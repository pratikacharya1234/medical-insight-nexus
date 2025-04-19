
import React, { useState, useEffect } from 'react';
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
import { toast } from '@/components/ui/sonner';

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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    consent: false
  });

  // Load patients from localStorage on component mount
  useEffect(() => {
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    }
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewPatient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setNewPatient(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleNewPatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Generate a unique ID for the patient
    const patientId = `PT-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Calculate age from DOB
    const birthDate = new Date(newPatient.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Format today's date
    const formattedDate = today.toISOString().split('T')[0];
    
    // Create new patient object
    const patient: Patient = {
      id: patientId,
      name: `${newPatient.firstName} ${newPatient.lastName}`,
      age,
      gender: newPatient.gender,
      condition: "New Patient",
      status: "active",
      lastVisit: formattedDate,
    };
    
    // Add to patients array
    const updatedPatients = [...patients, patient];
    setPatients(updatedPatients);
    
    // Save to localStorage
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
    
    // Reset form and close dialog
    setNewPatient({
      firstName: '',
      lastName: '',
      dob: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      consent: false
    });
    setIsDialogOpen(false);
    
    toast.success(`Patient ${patient.name} added successfully`);
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                    <Label htmlFor="firstName" className="text-right">
                      First name
                    </Label>
                    <Input 
                      id="firstName" 
                      value={newPatient.firstName}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastName" className="text-right">
                      Last name
                    </Label>
                    <Input 
                      id="lastName" 
                      value={newPatient.lastName}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dob" className="text-right">
                      Date of Birth
                    </Label>
                    <Input 
                      id="dob" 
                      type="date" 
                      value={newPatient.dob}
                      onChange={handleInputChange}
                      className="col-span-3" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gender" className="text-right">
                      Gender
                    </Label>
                    <Select value={newPatient.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
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
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={newPatient.phone}
                      onChange={handleInputChange}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={newPatient.email}
                      onChange={handleInputChange}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input 
                      id="address" 
                      value={newPatient.address}
                      onChange={handleInputChange}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right" htmlFor="consent">
                      Consent
                    </Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Checkbox 
                        id="consent" 
                        checked={newPatient.consent}
                        onCheckedChange={(checked) => handleCheckboxChange('consent', checked === true)}
                      />
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
                    {patients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No patients found. Click "New Patient" to add one.
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
                  {patients.length === 0 ? 
                    "No patients yet" : 
                    `Showing ${filteredPatients.length} of ${patients.length} patients`
                  }
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" disabled={patients.length === 0}>Export</Button>
                  <Button size="sm" disabled={patients.length === 0}>Bulk Action</Button>
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
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming appointments scheduled.
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
                <div className="text-center py-8 text-muted-foreground">
                  No recent patient activity.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

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

export default Patients;
