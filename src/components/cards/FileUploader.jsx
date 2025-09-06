import React, { useCallback } from 'react';

const fileIcons = {
  pdf: { icon: '📄', color: 'text-red-500' },
  csv: { icon: '📈', color: 'text-green-500' },
  xls: { icon: '📊', color: 'text-green-500' },
  xlsx: { icon: '📊', color: 'text-green-500' },
  doc: { icon: '📝', color: 'text-blue-500' },
  docx: { icon: '📝', color: 'text-blue-500' },
  jpg: { icon: '🖼️', color: 'text-purple-500' },
  jpeg: { icon: '🖼️', color: 'text-purple-500' },
  png: { icon: '🖼️', color: 'text-purple-500' },
  gif: { icon: '🖼️', color: 'text-purple-500' },
  default: { icon: '📎', color: 'text-gray-500' },
};

const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  return fileIcons[extension] || fileIcons.default;
};

export default function FileUploader({ files = [], onChange }) {
  const handleAddFiles = useCallback((e) => {
    const newFiles = Array.from(e.target.files).filter(
      (file) => file.size <= 10 * 1024 * 1024 // Max 10MB
    );
    onChange([...files, ...newFiles]);
  }, [files, onChange]);

  const handleRemoveFile = useCallback(
    (index) => {
      onChange(files.filter((_, i) => i !== index));
    },
    [files, onChange]
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Attachments</label>
      <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
        <div className="text-center">
          <svg
            className="w-8 h-8 text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-1 text-sm text-gray-600">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PDF, CSV, DOC, JPG, PNG (Max 10MB)</p>
        </div>
        <input
          type="file"
          multiple
          onChange={handleAddFiles}
          className="hidden"
          accept=".pdf,.csv,.xls,.xlsx,.doc,.docx,.jpg,.jpeg,.png,.gif"
        />
      </label>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => {
            const isExisting = typeof file === 'string';
            const fileName = isExisting ? file.split('/').pop() : file.name;
            const sizeText = isExisting ? 'Existing attachment' : `${(file.size / 1024).toFixed(1)} KB`;
            const { icon, color } = getFileIcon(fileName);
            return (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${color}`}>{icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{fileName}</p>
                    <p className="text-xs text-gray-500">{sizeText}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(i)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}