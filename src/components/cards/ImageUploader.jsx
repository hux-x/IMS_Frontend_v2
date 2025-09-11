import React, { useCallback, useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function ImageUploader({ images = [], onChange }) {
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    const newUrls = images.map((img) => {
      if (img instanceof File) return URL.createObjectURL(img);
      return img.startsWith('/uploads') ? `http://localhost:5000${img}` : img;
    });
    setPreviewUrls(newUrls);

    return () => {
      newUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);

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
      <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200 shadow-sm">
        <div className="text-center">
          <svg
            className="w-10 h-10 text-black mx-auto"
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
            <span className="font-semibold text-black hover:text-gray-800">Click to upload</span> or drag and drop
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
              className="text-sm text-red-500 hover:text-red-600 transition-colors duration-200"
            >
              Clear all
            </button>
          </div>
          <Carousel
            showThumbs={images.length > 1}
            showStatus={false}
            infiniteLoop
            emulateTouch
            className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden"
          >
            {images.map((img, i) => (
              <div key={i} className="relative h-60">
                <img
                  src={previewUrls[i]}
                  alt={`Upload preview ${i + 1}`}
                  className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(i);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
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