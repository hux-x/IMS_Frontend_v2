// File: src/components/FileAttachment.jsx
import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';

const FileAttachment = ({ attachments = [], showPreview = false }) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    // You can extend this with more specific icons
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      txt: '📄',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      zip: '🗜️',
      rar: '🗜️',
    };
    
    return iconMap[extension] || '📎';
  };

  const handleFileDownload = (fileUrl, fileName) => {
    // Create a download link
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilePreview = (fileUrl) => {
    // Open file in new tab for preview
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="mt-3">
      <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
      <div className="space-y-2">
        {attachments.map((attachment, index) => {
          // Handle both string URLs and object formats
          const fileUrl = typeof attachment === 'string' ? attachment : attachment.url;
          const fileName = typeof attachment === 'string' 
            ? attachment.split('/').pop() 
            : (attachment.name || attachment.originalName || `attachment_${index + 1}`);
          
          return (
            <div 
              key={index}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-2"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getFileIcon(fileName)}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                    {fileName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {showPreview && (
                  <button
                    onClick={() => handleFilePreview(fileUrl)}
                    className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                    title="Preview file"
                  >
                    <Eye size={14} />
                  </button>
                )}
                
                <button
                  onClick={() => handleFileDownload(fileUrl, fileName)}
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  title="Download file"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileAttachment;