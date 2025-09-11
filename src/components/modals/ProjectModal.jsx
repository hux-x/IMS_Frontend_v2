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
  mode,
  onClose,
  onSwitchMode,
  onDelete,
  onCreate,
  onUpdate,
  addChecklistTask,
  toggleChecklistTask,
  deleteChecklistTask,
  deleteProjectFiles,
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

  const handleSubmit = async (updatedData) => {
    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        await onCreate(updatedData);
      } else {
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
        await onUpdate(project._id, updatedData);
        toast.success('Project updated');
      }
      onSwitchMode('view');
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

  const modalTitle = mode === 'create' ? 'Create New Project' : mode === 'edit' ? 'Edit Project' : project.projectTitle;

  if (mode === 'create' || mode === 'edit') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-all duration-300">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-lg border border-gray-200">
          <div className="sticky top-0 bg-white p-4 border-b border-gray-200 z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">{modalTitle}</h2>
              <button
                onClick={onClose}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
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
            </div>
          </div>
          <div className="p-4">
            <ProjectForm
              initialData={mode === 'create' ? {} : project}
              onSubmit={handleSubmit}
              onCancel={() => onSwitchMode('view')}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-all duration-300">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-lg border border-gray-200">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{modalTitle}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ring-1 ring-inset ${getBadgeStyles(
                    'status',
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ring-1 ring-inset ${getBadgeStyles(
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
                onClick={() => onSwitchMode('edit')}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
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
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
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
            </div>
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h2 className="text-xl font-medium text-gray-800 mb-3">Project Overview</h2>
              <p className="text-gray-600">
                {project.description || (
                  <span className="text-gray-400 italic">No description provided.</span>
                )}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h2 className="text-xl font-medium text-gray-800 mb-3">Project Timeline</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Start Date</span>
                  <span className="text-sm text-gray-600">
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">End Date</span>
                  <span className="text-sm text-gray-600">
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
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h2 className="text-xl font-medium text-gray-800 flex items-center justify-between mb-3">
                <span>Design Checklist</span>
                <span className="text-sm text-gray-600">
                  {completed}/{total} completed
                </span>
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex gap-3 mb-4">
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm"
                  placeholder="Add new task"
                />
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                >
                  Add
                </button>
              </div>
              {project.designChecklist?.length > 0 && (
                <div className="space-y-2">
                  {project.designChecklist.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center group p-2 bg-white rounded-md border border-gray-200"
                    >
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => handleToggleTask(item._id)}
                        className="w-4 h-4 text-red-500 rounded border-gray-300 focus:ring-red-500 mr-3"
                      />
                      <span
                        className={`flex-1 text-sm ${
                          item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-600'
                        } group-hover:text-red-500 transition-colors duration-200`}
                      >
                        {item.task}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(item._id)}
                        className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {imageUrls?.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h2 className="text-xl font-medium text-gray-800 mb-3">Project Gallery ({imageUrls.length})</h2>
                <Carousel
                  showThumbs={imageUrls.length > 1}
                  showStatus={false}
                  showIndicators={imageUrls.length > 1}
                  infiniteLoop
                  emulateTouch
                  className="rounded-md overflow-hidden"
                >
                  {imageUrls.map((img, index) => (
                    <div key={index} className="relative h-64 bg-gray-100 flex items-center justify-center group">
                      <img
                        src={img}
                        alt={`Project image ${index + 1}`}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/400x200?text=Image+Not+Found';
                        }}
                        loading="lazy"
                      />
                      {project.projectImages[index].startsWith('/uploads') && (
                        <button
                          onClick={() => handleDeleteImage(project.projectImages[index])}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h2 className="text-xl font-medium text-gray-800 mb-3">Client Details</h2>
              <div className="space-y-2">
                <div className="p-2 bg-white rounded-md border border-gray-200">
                  <label className="block text-xs font-medium text-gray-500">Name</label>
                  <p className="text-sm text-gray-600 mt-1">{project.clientName || 'Not provided'}</p>
                </div>
                {project.clientEmail && (
                  <div className="p-2 bg-white rounded-md border border-gray-200">
                    <label className="block text-xs font-medium text-gray-500">Email</label>
                    <a
                      href={`mailto:${project.clientEmail}`}
                      className="text-sm text-red-500 hover:text-red-600 transition-colors duration-200 mt-1"
                    >
                      {project.clientEmail}
                    </a>
                  </div>
                )}
                {project.clientPhone && (
                  <div className="p-2 bg-white rounded-md border border-gray-200">
                    <label className="block text-xs font-medium text-gray-500">Phone</label>
                    <a
                      href={`tel:${project.clientPhone}`}
                      className="text-sm text-gray-600 hover:text-red-500 transition-colors duration-200 mt-1"
                    >
                      {project.clientPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
            {project.attachments?.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h2 className="text-xl font-medium text-gray-800 mb-3">Attachments ({project.attachments.length})</h2>
                <div className="space-y-2">
                  {project.attachments.map((file, index) => {
                    const fileName = file.name || file.originalName || file.filename || `Attachment ${index + 1}`;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200 group"
                      >
                        <button
                          onClick={() => handleFileOpen(file)}
                          className="flex items-center flex-1 gap-3"
                        >
                          <span className="text-2xl group-hover:scale-105 transition-transform duration-200">
                            {getFileIcon(fileName).split(' ')[0]}
                          </span>
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-600 truncate group-hover:text-red-500 transition-colors duration-200">
                              {fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getFileIcon(fileName)} • {formatFileSize(file.size)}
                            </p>
                          </div>
                        </button>
                        {file.startsWith('/uploads') && (
                          <button
                            onClick={() => handleDeleteAttachment(file)}
                            className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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