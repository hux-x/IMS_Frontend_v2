import React, { useState, useEffect } from "react";
import { X, Upload, CheckCircle, AlertCircle, Loader } from "lucide-react";

export default function UploadProgressToast() {
  const [uploads, setUploads] = useState([]);
  const [completedUploads, setCompletedUploads] = useState([]);

  useEffect(() => {
    const handleShowProgress = (event) => {
      const { files } = event.detail;
      const uploadId = Date.now();
      
      setUploads(prev => [...prev, {
        id: uploadId,
        files: files.map(f => ({
          ...f,
          progress: 0,
          status: 'uploading'
        })),
        status: 'uploading',
        startTime: Date.now()
      }]);
    };

    const handleProgress = (event) => {
      const { fileId, fileName, progress } = event.detail;
      
      setUploads(prev => prev.map(upload => ({
        ...upload,
        files: upload.files.map(file => 
          file.uploadInfo?.fileId === fileId
            ? { ...file, progress: Math.round(progress) }
            : file
        )
      })));
    };

    const handleUploadComplete = (event) => {
      const { success, count, files, error } = event.detail;
      
      setUploads(prev => prev.slice(0, -1));

      const completionId = Date.now();
      setCompletedUploads(prev => [...prev, {
        id: completionId,
        success,
        count,
        files,
        error
      }]);

      setTimeout(() => {
        setCompletedUploads(prev => prev.filter(u => u.id !== completionId));
      }, 5000);
    };

    window.addEventListener('show-upload-progress', handleShowProgress);
    window.addEventListener('upload-progress', handleProgress);
    window.addEventListener('upload-complete', handleUploadComplete);

    return () => {
      window.removeEventListener('show-upload-progress', handleShowProgress);
      window.removeEventListener('upload-progress', handleProgress);
      window.removeEventListener('upload-complete', handleUploadComplete);
    };
  }, []);

  const removeUpload = (id) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  const removeCompletion = (id) => {
    setCompletedUploads(prev => prev.filter(u => u.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getOverallProgress = (upload) => {
    if (upload.files.length === 0) return 0;
    const totalProgress = upload.files.reduce((sum, file) => sum + (file.progress || 0), 0);
    return Math.round(totalProgress / upload.files.length);
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm w-full">
      {/* Active Uploads */}
      {uploads.map((upload) => {
        const overallProgress = getOverallProgress(upload);
        
        return (
          <div
            key={upload.id}
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-slide-in"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin">
                  <Loader className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Uploading Files</h4>
                  <p className="text-sm text-gray-600">
                    {upload.files.length} file(s) • {overallProgress}%
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeUpload(upload.id)}
                className="text-gray-400 hover:text-gray-600"
                title="Hide (upload continues)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {upload.files.map((file, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate text-gray-700 flex-1">{file.name}</span>
                    <span className="text-gray-500 ml-2 text-xs">{file.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-600 h-1 rounded-full transition-all duration-300" 
                      style={{ width: `${file.progress}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${overallProgress}%` }} 
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              ⚠️ Don't close or refresh the page during upload
            </p>
          </div>
        );
      })}

      {/* Completed Uploads */}
      {completedUploads.map((completion) => (
        <div
          key={completion.id}
          className={`rounded-lg shadow-lg border p-4 animate-slide-in ${
            completion.success
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {completion.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <div>
                <h4 className={`font-semibold ${
                  completion.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {completion.success ? 'Upload Complete!' : 'Upload Failed'}
                </h4>
                <p className={`text-sm ${
                  completion.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {completion.success
                    ? `${completion.count} file(s) uploaded successfully`
                    : completion.error || 'An error occurred during upload'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => removeCompletion(completion.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}