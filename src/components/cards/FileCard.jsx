import React from "react";
import { Download, Trash2, FileText, Image, Video, Music, File } from "lucide-react";

export default function FileCard({ file, onDownload, onDelete }) {
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "image": return <Image className="w-8 h-8 text-blue-500" />;
      case "video": return <Video className="w-8 h-8 text-purple-500" />;
      case "audio": return <Music className="w-8 h-8 text-green-500" />;
      case "document": return <FileText className="w-8 h-8 text-orange-500" />;
      default: return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-shrink-0">
          {getFileIcon(file.fileType)}
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={onDownload}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <h3 className="font-medium text-gray-900 truncate mb-2" title={file.fileName}>
        {file.fileName}
      </h3>
      
      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Type:</span>
          <span className="font-medium">{file.extension?.toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span>Size:</span>
          <span className="font-medium">{formatFileSize(file.size)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Status:</span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            file.status === "uploaded" 
              ? "bg-green-100 text-green-800" 
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {file.status}
          </span>
        </div>
      </div>
      
      {file.description && (
        <p className="mt-3 text-sm text-gray-500 italic line-clamp-2" title={file.description}>
          {file.description}
        </p>
      )}
    </div>
  );
}