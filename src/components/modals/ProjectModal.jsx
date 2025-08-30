// components/modals/ProjectModal.js
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function ProjectModal({ project, onClose }) {
  
  const handleFileOpen = (file) => {
    const filePath = file.path || file;
    const fileName = file.originalName || file.filename || 'file';
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const fileUrl = `http://localhost:5000${filePath}`;

    // Open files in their appropriate applications
    switch(fileExtension) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'xls':
      case 'xlsx':
      case 'ppt':
      case 'pptx':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        // Open in new tab for viewable files
        window.open(fileUrl, '_blank');
        break;
      default:
        // Download for other file types
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase() || '';
    switch(ext) {
      case 'pdf': return '📄 PDF';
      case 'doc': case 'docx': return '📝 Word';
      case 'xls': case 'xlsx': return '📊 Excel';
      case 'csv': return '📈 CSV';
      case 'ppt': case 'pptx': return '📽️ PowerPoint';
      case 'jpg': case 'jpeg': return '🖼️ JPEG';
      case 'png': return '🖼️ PNG';
      case 'gif': return '🖼️ GIF';
      case 'zip': case 'rar': return '📦 Archive';
      default: return '📎 File';
    }
  };

  const formatFileSize = (size) => {
    if (!size) return '';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                {project.projectTitle}
              </h1>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Proposed' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  project.status === 'mature' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                  project.status === 'In-Progress' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  'bg-green-100 text-green-800 border border-green-200'
                }`}>
                  {project.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.priority === 'High' ? 'bg-red-100 text-red-800 border border-red-200' :
                  project.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                  'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {project.priority} Priority
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Project Details */}
            <div className="space-y-6">
              
              {/* Description */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-1 h-6 bg-blue-500 rounded mr-3"></span>
                  Project Overview
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {project.description || (
                      <span className="text-gray-500 italic">No description provided.</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-1 h-6 bg-green-500 rounded mr-3"></span>
                  Project Timeline
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">Start Date</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-600">End Date</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              {project.designChecklist?.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                    <span className="flex items-center">
                      <span className="w-1 h-6 bg-purple-500 rounded mr-3"></span>
                      Design Checklist
                    </span>
                    <span className="text-sm font-normal text-gray-500">
                      {project.designChecklist.filter(item => item.isCompleted).length}/
                      {project.designChecklist.length} completed
                    </span>
                  </h2>
                  <div className="space-y-2">
                    {project.designChecklist.map((item, index) => (
                      <div key={index} className="flex items-center py-2">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                          item.isCompleted 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300'
                        }`}>
                          {item.isCompleted && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm ${item.isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Media & Files */}
            <div className="space-y-6">
              
              {/* Image Gallery */}
              {project.projectImages?.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-1 h-6 bg-amber-500 rounded mr-3"></span>
                    Project Gallery
                  </h2>
                  <Carousel 
                    showThumbs={project.projectImages.length > 1}
                    showStatus={false}
                    showIndicators={project.projectImages.length > 1}
                    infiniteLoop
                    autoPlay={false}
                    emulateTouch
                    className="rounded-lg overflow-hidden"
                  >
                    {project.projectImages.map((img, index) => (
                      <div key={index} className="h-64 bg-gray-100 flex items-center justify-center">
                        <img 
                          src={`http://localhost:5000${img}`}
                          alt={`Project image ${index + 1}`}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                          }}
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              )}

              {/* Client Information */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-1 h-6 bg-indigo-500 rounded mr-3"></span>
                  Client Details
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                    <p className="text-gray-900 font-medium">{project.clientName || 'Not provided'}</p>
                  </div>
                  {project.clientEmail && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                      <a 
                        href={`mailto:${project.clientEmail}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        {project.clientEmail}
                      </a>
                    </div>
                  )}
                  {project.clientPhone && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                      <a 
                        href={`tel:${project.clientPhone}`}
                        className="text-gray-900 font-medium text-sm"
                      >
                        {project.clientPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Attachments */}
              {project.attachments?.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-1 h-6 bg-gray-500 rounded mr-3"></span>
                    Attachments ({project.attachments.length})
                  </h2>
                  <div className="space-y-2">
                    {project.attachments.map((file, index) => (
                      <button
                        key={index}
                        onClick={() => handleFileOpen(file)}
                        className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-100">
                          <span className="text-lg">{getFileIcon(file.originalName || file.filename).split(' ')[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.originalName || file.filename || `Attachment ${index + 1}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getFileIcon(file.originalName || file.filename)} •{' '}
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 ml-2 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}