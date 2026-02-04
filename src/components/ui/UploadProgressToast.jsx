import React from 'react';
import { Upload, CheckCircle } from 'lucide-react';

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

export default function UploadProgressToast({ files }) {
  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm w-full z-50">
      <div className="flex items-center gap-2 mb-3">
        <Upload className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-gray-900">Uploading Files</h3>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {files.map((file, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="truncate flex-1 text-gray-700">{file.name}</span>
              {file.progress === 100 ? (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
              ) : (
                <span className="text-gray-500 flex-shrink-0 ml-2">
                  {Math.round(file.progress || 0)}%
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{formatFileSize(file.size)}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  file.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${file.progress || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}