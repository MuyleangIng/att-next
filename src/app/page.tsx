"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [nameOfAttendance, setNameOfAttendance] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const isValidType = selectedFile.name.endsWith('.csv') || 
                         selectedFile.name.endsWith('.xls') || 
                         selectedFile.name.endsWith('.xlsx');
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file",
          variant: "destructive"
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const clearAllRecords = async () => {
    setIsClearing(true);
    try {
      const response = await fetch('http://202.178.125.77:5444/api/v1/api/v1/attendance/delete-all?confirm=true', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear records');
      }

      toast({
        title: "Success!",
        description: "All previous records cleared successfully",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Failed to clear records",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsClearing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !nameOfAttendance) {
      toast({
        title: "Missing information",
        description: "Please provide both a file and attendance name",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    // First clear all records
    const cleared = await clearAllRecords();
    if (!cleared) {
      setIsUploading(false);
      return;
    }

    // Then upload new file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name_of_attendance', nameOfAttendance);

    try {
      const response = await fetch('http://202.178.125.77:5444/api/v1/api/v1/attendance/upload-attendance', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      toast({
        title: "Success!",
        description: "Attendance file uploaded successfully",
      });

      router.push('/users');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Upload Attendance File</CardTitle>
            <CardDescription>
              Upload your attendance data in CSV or Excel format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nameOfAttendance">Name of Attendance</Label>
                <Input
                  id="nameOfAttendance"
                  value={nameOfAttendance}
                  onChange={(e) => setNameOfAttendance(e.target.value)}
                  placeholder="Enter attendance name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload File</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Input
                    id="file"
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label 
                    htmlFor="file" 
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <FileUp className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </span>
                    <span className="text-xs text-gray-400">
                      CSV or Excel files only
                    </span>
                  </Label>
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    type="button" 
                    className="w-full"
                    disabled={isUploading || isClearing || !file || !nameOfAttendance}
                  >
                    {isUploading || isClearing ? (
                      <>
                        <Upload className="mr-2 h-4 w-4 animate-spin" />
                        {isClearing ? 'Clearing...' : 'Uploading...'}
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Attendance
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete all existing attendance records before uploading the new file.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleSubmit}
                      className="bg-primary"
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );}