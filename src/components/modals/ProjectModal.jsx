import React, { memo } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { getBadgeStyles } from '@/components/cards/ProjectList';

const fileIcons = {
  pdf: '📄 PDF',
  doc: '📝 Word',
  docx: '📝 Word',
  xls: '📊 Excel',
  xlsx: '📊 Excel',
  csv: '📈 CSV',
  ppt: '📽️ PowerPoint',
  pptx: '📽️ PowerPoint',
  jpg: '🖼️ JPEG',
  jpeg: '🖼️ JPEG',
  png: '🖼️ PNG',
  gif: '🖼️ GIF',
  zip: '📦 Archive',
  rar: '📦 Archive',
  default: '📎 File',
};

const formatFileSize = (size) => {
  if (!size) return 'Unknown size';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const ProjectModalContent = memo(({ project, onClose }) => {
  const handleFileOpen = (file) => {
    const fileName = file.name || file.originalName || file.filename || 'file';
    const extension = fileName.split('.').pop().toLowerCase();
    let fileUrl;
    if (file instanceof File) {
      fileUrl = URL.createObjectURL(file);
    } else {
      const filePath = file.path || file;
      fileUrl = `http://localhost:5000${filePath}`;
    }

    switch (extension) {
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
        window.open(fileUrl, '_blank');
        break;
      default:
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
    return fileIcons[ext] || fileIcons.default;
  };

  const completed = project.designChecklist?.filter((item) => item.isCompleted).length || 0;
  const total = project.designChecklist?.length || 0;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in duration-300">
        {/* Header - Elegant classical styling with serif font */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-rose-50 p-6 border-b border-gray-200 z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">{project.projectTitle}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getBadgeStyles(
                    'status',
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getBadgeStyles(
                    'priority',
                    project.priority
                  )}`}
                >
                  {project.priority} Priority
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-amber-100 rounded-lg transition-all duration-300"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gradient-to-b from-white to-gray-50">
          {/* Left Column - Details */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-lg font-serif font-bold text-gray-900 flex items-center">
                <span className="w-1 h-6 bg-blue-400 rounded mr-3"></span>
                Project Overview
              </h2>
              <p className="mt-3 text-gray-700 font-serif">
                {project.description || (
                  <span className="text-gray-500 italic">No description provided.</span>
                )}
              </p>
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-lg font-serif font-bold text-gray-900 flex items-center">
                <span className="w-1 h-6 bg-green-400 rounded mr-3"></span>
                Project Timeline
              </h2>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Start Date</span>
                  <span className="text-sm text-gray-900 font-serif">
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">End Date</span>
                  <span className="text-sm text-gray-900 font-serif">
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Not specified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist with Progress Bar for interactivity */}
            {project.designChecklist?.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-lg font-serif font-bold text-gray-900 flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="w-1 h-6 bg-purple-400 rounded mr-3"></span>
                    Design Checklist
                  </span>
                  <span className="text-sm text-gray-500 font-serif">
                    {completed}/{total} completed
                  </span>
                </h2>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="space-y-2">
                  {project.designChecklist.map((item, index) => (
                    <div key={index} className="flex items-center group hover:bg-gray-50 p-1 rounded transition-colors duration-200">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                          item.isCompleted
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300'
                        } group-hover:scale-110 transition-transform duration-200`}
                      >
                        {item.isCompleted && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm font-serif ${
                          item.isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'
                        }`}
                      >
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
            {/* Image Gallery with enhanced interactivity */}
            {project.projectImages?.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-lg font-serif font-bold text-gray-900 flex items-center">
                  <span className="w-1 h-6 bg-amber-400 rounded mr-3"></span>
                  Project Gallery ({project.projectImages.length})
                </h2>
                <Carousel
                  showThumbs={project.projectImages.length > 1}
                  showStatus={false}
                  showIndicators={project.projectImages.length > 1}
                  infiniteLoop
                  emulateTouch
                  className="mt-3 rounded-lg overflow-hidden"
                >
                  {project.projectImages.map((img, index) => (
                    <div key={index} className="h-64 bg-gray-100 flex items-center justify-center group">
                      <img
                        src={img instanceof File ? URL.createObjectURL(img) : img}
                        alt={`Project image ${index + 1}`}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                        }}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            )}

            {/* Client Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-lg font-serif font-bold text-gray-900 flex items-center">
                <span className="w-1 h-6 bg-indigo-400 rounded mr-3"></span>
                Client Details
              </h2>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">
                    Name
                  </label>
                  <p className="text-sm text-gray-900 font-serif">{project.clientName || 'Not provided'}</p>
                </div>
                {project.clientEmail && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase">
                      Email
                    </label>
                    <a
                      href={`mailto:${project.clientEmail}`}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {project.clientEmail}
                    </a>
                  </div>
                )}
                {project.clientPhone && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase">
                      Phone
                    </label>
                    <a
                      href={`tel:${project.clientPhone}`}
                      className="text-sm text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {project.clientPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Attachments with hover interactivity */}
            {project.attachments?.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-lg font-serif font-bold text-gray-900 flex items-center">
                  <span className="w-1 h-6 bg-gray-400 rounded mr-3"></span>
                  Attachments ({project.attachments.length})
                </h2>
                <div className="mt-3 space-y-2">
                  {project.attachments.map((file, index) => {
                    const fileName = file.name || file.originalName || file.filename || `Attachment ${index + 1}`;
                    return (
                      <button
                        key={index}
                        onClick={() => handleFileOpen(file)}
                        className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
                      >
                        <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                          {getFileIcon(fileName).split(' ')[0]}
                        </span>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-900 truncate font-serif">
                            {fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getFileIcon(fileName)} • {formatFileSize(file.size)}
                          </p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 ml-2 group-hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default function ProjectModal({ project, onClose }) {
  return <ProjectModalContent project={project} onClose={onClose} />;
}