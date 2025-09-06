import React, { useCallback } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function ImageUploader({ images = [], onChange }) {
  const handleAddImages = useCallback((e) => {
    const files = Array.from(e.target.files).filter((file) =>
      ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
    );
    onChange([...images, ...files]);
  }, [images, onChange]);

  const handleRemoveImage = useCallback(
    (index) => {
      onChange(images.filter((_, i) => i !== index));
    },
    [images, onChange]
  );

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Project Images</label>
      <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
        <div className="text-center">
          <svg
            className="w-10 h-10 text-gray-400 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">JPG, PNG, GIF</p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleAddImages}
          className="hidden"
        />
      </label>

      {images.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">
              {images.length} {images.length === 1 ? 'image' : 'images'} uploaded
            </span>
            <button
              onClick={() => onChange([])}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Clear all
            </button>
          </div>
          <Carousel
            showThumbs={images.length > 1}
            showStatus={false}
            infiniteLoop
            emulateTouch
            className="rounded-lg border border-gray-200 bg-gray-50"
          >
            {images.map((img, i) => (
              <div key={i} className="relative h-64">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Upload preview ${i + 1}`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(i);
                  }}
                  className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-white transition-all"
                >
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </Carousel>
          <p className="text-xs text-gray-500 mt-2">
            Swipe to view all images | Click to enlarge
          </p>
        </div>
      )}
    </div>
  );
}