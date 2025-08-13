import React from "react";

export default function ImageUploader({ images, onChange }) {
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    onChange([...images, ...files]);
  };

  const handleReplaceImage = (index, file) => {
    const updated = [...images];
    updated[index] = file;
    onChange(updated);
  };

  const handleRemoveImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block mb-1 font-medium">Project Images</label>
      <input type="file" multiple onChange={handleAddImages} className="mb-2" />
      <div className="flex gap-2 flex-wrap">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <img src={URL.createObjectURL(img)} alt="" className="w-24 h-24 object-cover rounded" />
            <input type="file" onChange={(e) => handleReplaceImage(i, e.target.files[0])} className="absolute bottom-0 left-0 text-xs opacity-70" />
            <button type="button" onClick={() => handleRemoveImage(i)} className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded">X</button>
          </div>
        ))}
      </div>
    </div>
  );
}
