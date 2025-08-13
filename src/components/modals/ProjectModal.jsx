import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function ProjectModal({ project, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{project.title}</h2>
            <div className="flex items-center space-x-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                project.status === 'Proposed' ? 'bg-blue-100 text-blue-800' :
                project.status === 'Mature' ? 'bg-purple-100 text-purple-800' :
                project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {project.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image Gallery - Now with Full Swipe Support */}
        {project.images?.length > 0 && (
          <div className="relative">
            <Carousel 
              showThumbs={project.images.length > 1}
              showStatus={false}
              infiniteLoop
              autoPlay={false}
              emulateTouch
              swipeable
              dynamicHeight
              className="rounded-t-lg overflow-hidden"
            >
              {project.images.map((img, i) => (
                <div key={i} className="h-[400px] bg-gray-50 flex items-center justify-center">
                  <img 
                    src={URL.createObjectURL(img)} 
                    alt={`Project image ${i+1}`} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ))}
            </Carousel>
            <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              {project.images.length} {project.images.length > 1 ? 'images' : 'image'}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Design Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  {project.description || 'No description provided yet.'}
                </p>
              </div>

              {/* Checklist */}
              {project.checklist?.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Design Milestones</h3>
                  <div className="space-y-3">
                    {project.checklist.map((item, i) => (
                      <div key={i} className="flex items-start p-4 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={item.done}
                          readOnly
                          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <label className={`block ${item.done ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                            {item.text}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Project Details */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-900 font-medium">{project.location || 'To be determined'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Timeline</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <div>
                        <p className="text-xs text-gray-500">Start</p>
                        <p className="text-gray-900 font-medium">{project.startDate || 'TBD'}</p>
                      </div>
                      <div className="h-4 w-px bg-gray-300"></div>
                      <div>
                        <p className="text-xs text-gray-500">Completion</p>
                        <p className="text-gray-900 font-medium">{project.endDate || 'TBD'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-gray-900 font-medium">{project.clientName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <a 
                      href={`mailto:${project.clientEmail}`} 
                      className="text-blue-600 hover:text-blue-800 font-medium block"
                    >
                      {project.clientEmail || 'Not provided'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}