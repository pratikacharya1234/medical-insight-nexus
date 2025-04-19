
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FileImage, FileText, FileUp, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FileWithPreview extends File {
  preview?: string;
  type: string;
}

export default function DiagnosticUpload() {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [patientNotes, setPatientNotes] = useState("");
  const [patientId, setPatientId] = useState("");
  const [imageType, setImageType] = useState("xray");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

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

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          handleUploadSuccess();
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleUploadSuccess = () => {
    toast({
      title: "Files uploaded successfully",
      description: `${files.length} file(s) have been uploaded for analysis`,
    });
    
    // In a real app, we would navigate to a results page or show analysis in progress
    setTimeout(() => {
      setPatientNotes("");
      setPatientId("");
      setFiles([]);
      setUploadProgress(0);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one medical image or document.",
        variant: "destructive",
      });
      return;
    }
    if (!patientId) {
      toast({
        title: "Patient ID required",
        description: "Please enter a patient ID to continue.",
        variant: "destructive",
      });
      return;
    }
    simulateUpload();
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
            <Input
              id="patientId"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient identifier"
              required
            />
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
                <Label>Uploading</Label>
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
