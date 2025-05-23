
import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FileImage, FileText, FileUp, X, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { analyzeMedicalData } from "@/lib/gemini-service";

interface FileWithPreview extends File {
  preview?: string;
  type: string;
}

export default function DiagnosticUpload() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [patientNotes, setPatientNotes] = useState("");
  const [patientId, setPatientId] = useState("");
  const [imageType, setImageType] = useState("xray");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);

  // Load patients from localStorage
  useEffect(() => {
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map((file) => {
      // Create preview for image files
      if (file.type.startsWith("image/")) {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      }
      return file;
    });
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      // Revoke object URL to avoid memory leaks
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleAnalysis = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 5;
      });
    }, 150);
    
    try {
      // Perform analysis using Gemini API
      const result = await analyzeMedicalData(files, patientNotes, patientId);
      
      if (result.success) {
        // Complete the progress bar
        setUploadProgress(100);
        clearInterval(progressInterval);
        
        // Create an analysis record
        const analysisId = `AN-${Math.floor(100000 + Math.random() * 900000)}`;
        const now = new Date();
        const formattedDate = now.toISOString();
        
        const newAnalysis = {
          id: analysisId,
          patientId: patientId,
          date: formattedDate,
          type: imageType,
          notes: patientNotes,
          status: 'completed',
          result: result
        };
        
        // Save to localStorage
        const existingAnalyses = JSON.parse(localStorage.getItem('analyses') || '[]');
        const updatedAnalyses = [...existingAnalyses, newAnalysis];
        localStorage.setItem('analyses', JSON.stringify(updatedAnalyses));
        
        // Create a notification
        const notification = {
          id: `NT-${Math.floor(100000 + Math.random() * 900000)}`,
          title: 'Analysis Completed',
          message: `Analysis for patient ${patientId} has been completed.`,
          time: formattedDate,
          read: false
        };
        
        const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const updatedNotifications = [notification, ...existingNotifications];
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        
        // Success message
        toast.success("Analysis completed successfully");
        
        // Navigate to results after a short delay
        setTimeout(() => {
          navigate('/results');
        }, 1000);
      } else {
        clearInterval(progressInterval);
        setUploadProgress(0);
        setIsUploading(false);
        toast.error("Analysis failed. Please try again.");
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setIsUploading(false);
      toast.error("An error occurred during analysis");
      console.error("Analysis error:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("No files selected");
      return;
    }
    if (!patientId) {
      toast.error("Patient ID required");
      return;
    }
    handleAnalysis();
  };

  const getFileIcon = (file: FileWithPreview) => {
    if (file.type.startsWith("image/")) {
      return <FileImage className="h-5 w-5" />;
    } else if (file.type.includes("pdf") || file.type.includes("document")) {
      return <FileText className="h-5 w-5" />;
    }
    return <FileUp className="h-5 w-5" />;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Medical Data</CardTitle>
          <CardDescription>
            Upload medical images and documents for AI-powered diagnostic analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Patient ID */}
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient ID</Label>
            <Select 
              value={patientId} 
              onValueChange={setPatientId}
            >
              <SelectTrigger id="patientId">
                <SelectValue placeholder="Select or enter patient ID" />
              </SelectTrigger>
              <SelectContent>
                {patients.length === 0 ? (
                  <SelectItem value="new">Add new patient</SelectItem>
                ) : (
                  patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.id} - {patient.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Image type selector */}
          <div className="space-y-2">
            <Label htmlFor="imageType">Image Type</Label>
            <Select value={imageType} onValueChange={setImageType}>
              <SelectTrigger id="imageType">
                <SelectValue placeholder="Select image type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xray">X-Ray</SelectItem>
                <SelectItem value="mri">MRI</SelectItem>
                <SelectItem value="ct">CT Scan</SelectItem>
                <SelectItem value="ultrasound">Ultrasound</SelectItem>
                <SelectItem value="pathology">Pathology</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File upload area */}
          <div className="space-y-2">
            <Label htmlFor="fileUpload">Medical Images & Documents</Label>
            <div
              className={`border-2 border-dashed rounded-md p-6 ${
                dragActive ? "border-primary bg-primary/5" : "border-input"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <FileUp className="h-8 w-8 text-muted-foreground" />
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    Drag files here or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: DICOM, JPG, PNG, PDF
                  </p>
                </div>
                <Input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,.pdf,.dcm"
                  disabled={isUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("fileUpload")?.click()}
                  disabled={isUploading}
                >
                  Select Files
                </Button>
              </div>
            </div>
          </div>

          {/* File preview */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files</Label>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center space-x-2">
                      {file.preview ? (
                        <div className="h-10 w-10 rounded border overflow-hidden">
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded bg-secondary/20 flex items-center justify-center">
                          {getFileIcon(file)}
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm font-medium truncate max-w-[200px]">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patient notes */}
          <div className="space-y-2">
            <Label htmlFor="patientNotes">Clinical Notes</Label>
            <Textarea
              id="patientNotes"
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              placeholder="Enter symptoms, medical history, or other relevant information..."
              rows={4}
            />
          </div>

          {/* Upload progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Processing</Label>
                <span className="text-xs text-muted-foreground">
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-medical-primary hover:bg-medical-primary/90"
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              "Upload and Analyze"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
