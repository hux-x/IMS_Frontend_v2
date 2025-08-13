import React from 'react'

const MarkerDescriptionModal = ({ show, description, setDescription, onSave, onClose }) => {
  if (!show) return null

  const handleSave = () => {
    if (!description.trim()) {
      alert('Please enter a description')
      return
    }
    onSave()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 transform transition-all duration-300 scale-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Add Marker Description
        </h3>

        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter description... (Ctrl+Enter to save, Esc to cancel)"
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          autoFocus
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!description.trim()}
            className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default MarkerDescriptionModal