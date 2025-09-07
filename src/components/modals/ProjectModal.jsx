import React, { memo, useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { getBadgeStyles } from '@/components/cards/ProjectList';
import ProjectForm from '@/components/cards/PorjectForm';
import { toast } from 'react-toastify';

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

export default memo(function ProjectModal({
  project,
  isEdit,
  onClose,
  onSwitchToEdit,
  onDelete,
  addChecklistTask,
  toggleChecklistTask,
  deleteChecklistTask,
  deleteProjectFiles,
  updateProject,
}) {
  const [imageUrls, setImageUrls] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const urls = project.projectImages?.map((img) => {
      if (img instanceof File) return URL.createObjectURL(img);
      return img.startsWith('/uploads') ? `http://localhost:5000${img}` : img;
    }) || [];
    setImageUrls(urls);
    return () => {
      urls.forEach((url) => url.startsWith('blob:') && URL.revokeObjectURL(url));
    };
  }, [project.projectImages]);

  const handleFileOpen = (file) => {
    const fileName = file.name || file.originalName || file.filename || 'file';
    const extension = fileName.split('.').pop().toLowerCase();
    let fileUrl;
    if (file instanceof File) {
      fileUrl = URL.createObjectURL(file);
    } else {
      const filePath = file.path || file;
      fileUrl = filePath.startsWith('/uploads') ? `http://localhost:5000${filePath}` : filePath;
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

  const handleAddTask = async () => {
    if (!newTask.trim()) {
      toast.error('Task cannot be empty');
      return;
    }
    try {
      await addChecklistTask(project._id, newTask);
      setNewTask('');
      toast.success('Task added');
    } catch (err) {
      toast.error('Failed to add task');
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      await toggleChecklistTask(project._id, taskId);
      toast.success('Task updated');
    } catch (err) {
      toast.error('Failed to toggle task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteChecklistTask(project._id, taskId);
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleDeleteImage = async (img) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await deleteProjectFiles(project._id, { removeImages: [img], removeAttachments: [] });
      toast.success('Image deleted');
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  const handleDeleteAttachment = async (att) => {
    if (!window.confirm('Are you sure you want to delete this attachment?')) return;
    try {
      await deleteProjectFiles(project._id, { removeImages: [], removeAttachments: [att] });
      toast.success('Attachment deleted');
    } catch (err) {
      toast.error('Failed to delete attachment');
    }
  };

  const handleSubmitUpdate = async (updatedData) => {
    setIsSubmitting(true);
    try {
      const removedImages = project.projectImages.filter(
        (img) => typeof img === 'string' && !updatedData.projectImages.includes(img)
      );
      const removedAttachments = project.attachments.filter(
        (att) => typeof att === 'string' && !updatedData.attachments.includes(att)
      );
      if (removedImages.length || removedAttachments.length) {
        await deleteProjectFiles(project._id, {
          removeImages: removedImages,
          removeAttachments: removedAttachments,
        });
      }
      await updateProject(project._id, updatedData);
      toast.success('Project updated');
      onSwitchToEdit(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase() || '';
    return fileIcons[ext] || fileIcons.default;
  };

  const completed = project.designChecklist?.filter((item) => item.isCompleted).length || 0;
  const total = project.designChecklist?.length || 0;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  if (isEdit) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50 backdrop-blur-md animate-fade-in">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200/50 ring-1 ring-white/20 transform scale-95 animate-scale-up">
          <ProjectForm
            initialData={project}
            onSubmit={handleSubmitUpdate}
            onCancel={() => onSwitchToEdit(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200/50 ring-1 ring-white/20 transform scale-95 animate-scale-up">
        <div className="sticky top-0 bg-gradient-to-br from-amber-50/90 to-rose-50/90 p-6 border-b border-gray-200/50 z-10 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">{project.projectTitle}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ring-1 ring-inset transition-all hover:shadow-md ${getBadgeStyles(
                    'status',
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ring-1 ring-inset transition-all hover:shadow-md ${getBadgeStyles(
                    'priority',
                    project.priority
                  )}`}
                >
                  {project.priority} Priority
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onSwitchToEdit(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this project?')) {
                    onDelete(project._id);
                    onClose();
                  }
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full hover:from-red-700 hover:to-rose-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Delete Project
              </button>
              <button
                onClick={onClose}
                className="p-2.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-white/50 transition-all hover:shadow-md"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-gradient-to-br from-white/95 to-gray-50/95">
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm p-7 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <h2 className="text-xl font-serif font-bold text-gray-900 flex items-center">
                <span className="w-1.5 h-7 bg-blue-500 rounded-full mr-4 animate-pulse"></span>
                Project Overview
              </h2>
              <p className="mt-4 text-gray-700 font-serif leading-relaxed">
                {project.description || (
                  <span className="text-gray-500 italic">No description provided.</span>
                )}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-7 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <h2 className="text-xl font-serif font-bold text-gray-900 flex items-center">
                <span className="w-1.5 h-7 bg-emerald-500 rounded-full mr-4 animate-pulse"></span>
                Project Timeline
              </h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100 transition-colors">
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
                <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100 transition-colors">
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
            <div className="bg-white/80 backdrop-blur-sm p-7 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <h2 className="text-xl font-serif font-bold text-gray-900 flex items-center justify-between">
                <span className="flex items-center">
                  <span className="w-1.5 h-7 bg-purple-500 rounded-full mr-4 animate-pulse"></span>
                  Design Checklist
                </span>
                <span className="text-sm text-gray-500 font-serif">
                  {completed}/{total} completed
                </span>
              </h2>
              <div className="mt-4 w-full bg-gray-200/50 rounded-full h-3 mb-5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex gap-3 mb-5">
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="flex-1 p-3 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white/50"
                  placeholder="Add new task"
                />
                <button
                  onClick={handleAddTask}
                  className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Add
                </button>
              </div>
              {project.designChecklist?.length > 0 && (
                <div className="space-y-3">
                  {project.designChecklist.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center group hover:bg-gray-50/50 p-3 rounded-xl transition-all duration-300 hover:shadow-md"
                    >
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => handleToggleTask(item._id)}
                        className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 mr-4 transition-all"
                      />
                      <span
                        className={`flex-1 text-base font-serif ${
                          item.isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'
                        } group-hover:text-purple-700 transition-colors`}
                      >
                        {item.task}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(item._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-8">
            {imageUrls?.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm p-7 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <h2 className="text-xl font-serif font-bold text-gray-900 flex items-center">
                  <span className="w-1.5 h-7 bg-amber-500 rounded-full mr-4 animate-pulse"></span>
                  Project Gallery ({imageUrls.length})
                </h2>
                <Carousel
                  showThumbs={imageUrls.length > 1}
                  showStatus={false}
                  showIndicators={imageUrls.length > 1}
                  infiniteLoop
                  emulateTouch
                  className="mt-4 rounded-2xl overflow-hidden shadow-inner"
                >
                  {imageUrls.map((img, index) => (
                    <div key={index} className="relative h-72 bg-gray-100/50 flex items-center justify-center group">
                      <img
                        src={img}
                        alt={`Project image ${index + 1}`}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/400x200?text=Image+Not+Found';
                        }}
                        loading="lazy"
                      />
                      {project.projectImages[index].startsWith('/uploads') && (
                        <button
                          onClick={() => handleDeleteImage(project.projectImages[index])}
                          className="absolute top-4 right-4 bg-red-600/80 text-white p-2 rounded-full hover:bg-red-700 transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </Carousel>
              </div>
            )}
            <div className="bg-white/80 backdrop-blur-sm p-7 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <h2 className="text-xl font-serif font-bold text-gray-900 flex items-center">
                <span className="w-1.5 h-7 bg-indigo-500 rounded-full mr-4 animate-pulse"></span>
                Client Details
              </h2>
              <div className="mt-4 space-y-4">
                <div className="p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100 transition-colors">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Name
                  </label>
                  <p className="text-base text-gray-900 font-serif mt-1">{project.clientName || 'Not provided'}</p>
                </div>
                {project.clientEmail && (
                  <div className="p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100 transition-colors">
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Email
                    </label>
                    <a
                      href={`mailto:${project.clientEmail}`}
                      className="text-base text-indigo-600 hover:text-indigo-800 transition-colors mt-1 font-serif"
                    >
                      {project.clientEmail}
                    </a>
                  </div>
                )}
                {project.clientPhone && (
                  <div className="p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100 transition-colors">
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Phone
                    </label>
                    <a
                      href={`tel:${project.clientPhone}`}
                      className="text-base text-gray-900 hover:text-indigo-600 transition-colors mt-1 font-serif"
                    >
                      {project.clientPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
            {project.attachments?.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm p-7 rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <h2 className="text-xl font-serif font-bold text-gray-900 flex items-center">
                  <span className="w-1.5 h-7 bg-gray-500 rounded-full mr-4 animate-pulse"></span>
                  Attachments ({project.attachments.length})
                </h2>
                <div className="mt-4 space-y-3">
                  {project.attachments.map((file, index) => {
                    const fileName = file.name || file.originalName || file.filename || `Attachment ${index + 1}`;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-md group"
                      >
                        <button
                          onClick={() => handleFileOpen(file)}
                          className="flex items-center flex-1 gap-4"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                            {getFileIcon(fileName).split(' ')[0]}
                          </span>
                          <div className="text-left">
                            <p className="text-base font-medium text-gray-900 truncate font-serif group-hover:text-gray-800">
                              {fileName}
                            </p>
                            <p className="text-xs text-gray-500 group-hover:text-gray-600">
                              {getFileIcon(fileName)} • {formatFileSize(file.size)}
                            </p>
                          </div>
                        </button>
                        {file.startsWith('/uploads') && (
                          <button
                            onClick={() => handleDeleteAttachment(file)}
                            className="text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
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