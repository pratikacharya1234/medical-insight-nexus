
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DiagnosticResults from '@/components/diagnostics/DiagnosticResults';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Printer, Download, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Results = () => {
  const navigate = useNavigate();
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Diagnostic Results</h1>
              <p className="text-muted-foreground">
                Patient #10234 • Analyzed April 19, 2025
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Star className="mr-2 h-4 w-4" />
              <span>Save</span>
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              <span>Print</span>
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
        
        <DiagnosticResults />
      </div>
    </AppLayout>
  );
};

export default Results;
