
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DiagnosticUpload from '@/components/diagnostics/DiagnosticUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Diagnostics = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">New Diagnostic Analysis</h1>
          <p className="text-muted-foreground">
            Upload medical images and information for AI-powered analysis
          </p>
        </div>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Multimodal Analysis</AlertTitle>
          <AlertDescription>
            Upload multiple types of data for comprehensive analysis. This includes medical images (X-rays, MRIs, CT scans), 
            lab reports, and clinical notes. The AI will analyze all inputs together for more accurate results.
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="col-span-3 md:col-span-2">
            <DiagnosticUpload />
          </div>
          
          <div className="col-span-3 md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supported File Types</CardTitle>
                <CardDescription>File formats we can currently process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Medical Images</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>DICOM (.dcm)</li>
                    <li>JPEG and PNG images</li>
                    <li>TIFF images</li>
                    <li>NIfTI files (.nii)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Documents</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>PDF reports</li>
                    <li>Text files (.txt)</li>
                    <li>Structured data (.csv, .json)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Analysis Capabilities</CardTitle>
                <CardDescription>What our system can currently analyze</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Radiology</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Chest X-rays - Pneumonia, effusions, nodules</li>
                      <li>CT Scans - Hemorrhages, tumors, fractures</li>
                      <li>MRIs - Brain, spine, and joint abnormalities</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Pathology</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Skin lesions and dermatological conditions</li>
                      <li>Basic histopathology patterns</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Text Analysis</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Clinical notes and symptoms</li>
                      <li>Medical history and risk factors</li>
                      <li>Laboratory results interpretation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Diagnostics;
