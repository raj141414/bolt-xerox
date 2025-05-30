import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, X, FileText } from 'lucide-react';
import { fileStorage, StoredFile } from '@/services/fileStorage';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  onPageCountChange: (pageCount: number) => void;
  onPdfDataChange: (pdfData: ArrayBuffer | null) => void;
}

const FileUploader = ({ onFilesChange, onPageCountChange, onPdfDataChange }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const isValidFileType = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return allowedTypes.includes(file.type);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (!isValidFileType(file)) {
        toast.error(`${file.name} is not a valid file type. Only PDF and Word documents are allowed.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
      // Only handle the first file for now
      const file = validFiles[0];
      
      try {
        // Store file in FileStorage service
        await fileStorage.saveFile(file);
        
        // Read file for PDF preview if it's a PDF
        if (file.type === 'application/pdf') {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const pdfData = e.target?.result as ArrayBuffer;
            onPdfDataChange(pdfData);
            
            // Load PDF to get page count
            const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
            onPageCountChange(pdf.numPages);
          };
          reader.readAsArrayBuffer(file);
        } else {
          // For Word documents, use a placeholder page count
          onPageCountChange(1);
          onPdfDataChange(null);
        }
        
        setFiles([file]);
        onFilesChange([file]);
        toast.success(`File added successfully`);
        
      } catch (error) {
        console.error('Error handling file:', error);
        toast.error(`Failed to process ${file.name}`);
      }
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    onPageCountChange(0);
    onPdfDataChange(null);
    toast.info("File removed");
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className={`file-drop-area ${isDragging ? 'file-drop-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
        <Upload className="mx-auto h-12 w-12 text-xerox-500 mb-2" />
        <p className="text-lg font-semibold text-xerox-700">
          Drag & Drop Files Here
        </p>
        <p className="text-gray-500">or click to browse</p>
        <p className="text-sm text-gray-500 mt-2">
          Accepted formats: PDF and Word documents only
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Uploaded Files</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-xerox-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;