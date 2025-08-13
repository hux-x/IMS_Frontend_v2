import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function ProjectModal({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    clientName: initialData?.clientName || "",
    clientContact: initialData?.clientContact || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    images: initialData?.images || [],
    projectType: initialData?.projectType || "",
    status: initialData?.status || "Proposed",
    features: initialData?.features || [],
    priority: initialData?.priority || "Medium"
  });

  const toggleFeature = (f) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(f) 
        ? prev.features.filter(x => x !== f)
        : [...prev.features, f]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {initialData ? "Edit Project" : "New Project"}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields same as previous implementation */}
            {/* ... */}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {initialData ? "Update Project" : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}