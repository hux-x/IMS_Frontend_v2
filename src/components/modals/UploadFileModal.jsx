import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import reposService from "@/apis/services/reposService";
import socketService from "@/apis/socket/config";

export default function UploadFilesModal({ repoId, chatId, userId, onClose, onUploadComplete }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    try {
      if (selectedFiles.length === 0) {
        alert("Please select files to upload");
        return;
      }

      setUploading(true);

      const filesMetadata = Array.from(selectedFiles).map(file => ({
        fileName: file.name,
        mimeType: file.type,
        size: file.size
      }));

      const res = await reposService.uploadFiles(repoId, {
        files: filesMetadata,
        description: description
      });

      // Close modal immediately
      onClose();

      // Show upload progress toast
      showUploadProgress(selectedFiles, res.data.uploads);

      // Start uploading files in background
      uploadFilesInBackground(selectedFiles, res.data.uploads, chatId, userId, onUploadComplete);

    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files");
      setUploading(false);
    }
  };

  const showUploadProgress = (files, uploads) => {
    const event = new CustomEvent('show-upload-progress', {
      detail: {
        files: Array.from(files).map((file, idx) => ({
          name: file.name,
          size: file.size,
          uploadInfo: uploads[idx]
        }))
      }
    });
    window.dispatchEvent(event);
  };

  const uploadFilesInBackground = async (files, uploads, chatId, userId, callback) => {
    window.uploadInProgress = true;
    
    try {
      const uploadPromises = Array.from(files).map(async (file, i) => {
        const uploadInfo = uploads[i];
        
        // Upload to presigned URL with progress tracking
        await uploadWithProgress(file, uploadInfo.presignedUrl, uploadInfo.fileId);

        // Mark as uploaded
        await reposService.markFileUploaded(uploadInfo.fileId);
        console.log("file marked as uploaded:", uploadInfo.fileId);
        
        return { 
          success: true, 
          fileName: file.name,
          fileId: uploadInfo.fileId,
          mimeType: file.type,
          size: file.size
        };
      });

      const results = await Promise.all(uploadPromises);
      
      window.uploadInProgress = false;
      
      // Notify success
      const successEvent = new CustomEvent('upload-complete', {
        detail: { 
          success: true, 
          count: results.length,
          files: results 
        }
      });
      window.dispatchEvent(successEvent);

      // Send file message to chat for each uploaded file
      results.forEach(file => {
        const fileMessage = `📎 ${file.fileName} (${formatFileSize(file.size)})`;
        socketService.sendMessage(
          chatId,
          userId,
          fileMessage,
          'file',
          {
            fileId: file.fileId,
            fileName: file.fileName,
            mimeType: file.mimeType,
            size: file.size
          },
          null
        );
      });

      // Refresh the file list
      callback();

    } catch (error) {
      console.error("Error in background upload:", error);
      window.uploadInProgress = false;
      
      const errorEvent = new CustomEvent('upload-complete', {
        detail: { success: false, error: error.message }
      });
      window.dispatchEvent(errorEvent);
    }
  };

  const uploadWithProgress = (file, presignedUrl, fileId) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          const progressEvent = new CustomEvent('upload-progress', {
            detail: {
              fileId,
              fileName: file.name,
              progress: percentComplete
            }
          });
          window.dispatchEvent(progressEvent);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was aborted'));
      });

      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Upload Files</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={uploading}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Files
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
              >
                Choose files
              </label>
              <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
              <p className="text-xs text-gray-400 mt-2">Upload multiple files at once</p>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-3 space-y-1 max-h-40 overflow-y-auto">
                <p className="text-sm font-medium text-gray-700">
                  {selectedFiles.length} file(s) selected:
                </p>
                {Array.from(selectedFiles).map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <span className="truncate flex-1">{file.name}</span>
                    <span className="ml-2 text-gray-500">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Add a description for these files..."
              disabled={uploading}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {uploading ? "Starting Upload..." : "Upload"}
            </button>
            <button
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}