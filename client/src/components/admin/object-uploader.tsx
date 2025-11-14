import { useState, useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Image, FileImage, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onComplete?: (result: { successful: Array<{ uploadURL: string }> }) => void;
  buttonClassName?: string;
  children?: ReactNode;
  onUpload?: (imageUrl: string) => void;
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 5242880, // 5MB default
  onComplete,
  buttonClassName,
  children,
  onUpload
}: ObjectUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > maxFileSize) {
        const sizeMB = Math.round(maxFileSize / 1024 / 1024);
        setError(`File size must be less than ${sizeMB}MB`);
        setUploadStatus('error');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        setUploadStatus('error');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setUploadStatus('idle');

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const uploadResponse = await fetch("/api/upload/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        let errorMessage = "Upload failed";
        try {
          const errorData = await uploadResponse.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // ignore JSON parse error, use default message
        }
        throw new Error(errorMessage);
      }

      const result = await uploadResponse.json();
      if (!result?.imageUrl) {
        throw new Error("Upload failed - no URL returned");
      }

      setUploadProgress(100);
      console.log("Upload successful:", result.imageUrl);

      onUpload?.(result.imageUrl);
      onComplete?.({
        successful: [{ uploadURL: result.imageUrl }],
      });

      setUploadStatus("success");
      setSelectedFile(null);
      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again.",
      );
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-6">
          {!selectedFile ? (
            // Upload trigger area
            <div 
              className="text-center cursor-pointer"
              onClick={triggerFileSelect}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Click to upload featured image
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Support JPG, PNG, WebP up to {Math.round(maxFileSize / 1024 / 1024)}MB
                  </p>
                </div>
                <Button type="button" variant="outline" className="mt-2">
                  <FileImage className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
              </div>
            </div>
          ) : (
            // File selected area
            <div className="space-y-4">
              {/* Preview */}
              {preview && (
                <div className="flex justify-center">
                  <div className="relative">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                      onClick={clearSelection}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* File info */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Image className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedFile.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              {/* Upload progress */}
              {isUploading && uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              {/* Upload button */}
              <div className="flex justify-center">
                <Button 
                  type="button"
                  onClick={handleUpload} 
                  disabled={isUploading}
                  className="min-w-32"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-700">Image uploaded successfully!</span>
        </div>
      )}

      {/* Alternative: Direct URL input */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">Or enter image URL directly:</p>
      </div>
    </div>
  );
}