import React from "react";

export default function FileUploader({ files, onChange }) {
  const handleAddFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    onChange([...files, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block mb-1 font-medium">Attachments</label>
      <input type="file" multiple onChange={handleAddFiles} className="mb-2" />
      <ul className="text-sm">
        {files.map((file, i) => (
          <li key={i} className="flex justify-between items-center border p-1 rounded mb-1">
            {file.name}
            <button type="button" onClick={() => handleRemoveFile(i)} className="text-red-500 text-xs">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
