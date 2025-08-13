import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function GalleryModal({ project, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Project details same as previous implementation */}
            {/* ... */}
          </div>

          {project.images?.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">Project Images</h3>
              <Carousel
                showThumbs={true}
                showStatus={false}
                infiniteLoop
                className="rounded-lg overflow-hidden"
              >
                {project.images.map((img, i) => (
                  <div key={i} className="h-96">
                    <img 
                      src={URL.createObjectURL(img)} 
                      alt="" 
                      className="h-full w-full object-contain bg-gray-100"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No images available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}