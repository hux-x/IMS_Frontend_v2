import React, { useState } from 'react';
import ImageMarker from 'react-image-marker';
import MarkerDescriptionModal from '@/components/modals/MarkerDescriptionModal';
import CustomMarker from '@/components/custom/CustomMarker';

const ImageMarkerComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tempMarker, setTempMarker] = useState(null);
  const [description, setDescription] = useState("");

  const handleImageClick = (marker) => {
    setTempMarker(marker);
    setDescription("");
    setShowModal(true);
  };

  const handleSaveMarker = () => {
    if (!description.trim()) return;
    const newMarker = {
      id: Date.now(),
      ...tempMarker,
      description,
      completed: false,
      showBox: false,
      persistentIndex: markers.length + 1,
    };
    setMarkers((prev) => [...prev, newMarker]);
    setShowModal(false);
  };

  const handleToggleMarker = (id) => {
    setMarkers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      )
    );
  };

  const handleSubmitChecklist = () => {
    const completedMarkers = markers.filter(m => m.completed);
    console.log("Submitted completed markers:", completedMarkers);
    alert(`Submitted ${completedMarkers.length} completed markers`);
  };



  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 bg-gray-50 rounded-xl shadow-md">
      {/* Image Section */}
      <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <ImageMarker
          markers={markers}
          onAddMarker={handleImageClick}
          src="/collection.webp"
          
        />
      </div>

      {/* Checklist Section */}
      <div className="w-full lg:w-1/3 bg-white rounded-lg shadow p-5 border border-gray-200 flex flex-col">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Markers List</h3>

        {markers.length === 0 ? (
          <p className="text-gray-500">No markers yet</p>
        ) : (
          <div className="space-y-3 flex-grow overflow-y-auto max-h-[70vh]">
            {markers.map((marker, index) => (
              <div
                key={marker.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                  marker.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-300'
                } text-gray-800`}
              >
                <label className="flex items-center gap-2 w-full cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={marker.completed}
                    onChange={() => handleToggleMarker(marker.id)}
                    className="w-4 h-4"
                  />
                  <span className="flex items-center gap-1 flex-1">
                    <span className="font-medium min-w-[20px]">
                      {index + 1}.
                    </span>
                    <span className="truncate">{marker.description}</span>
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSubmitChecklist}
          disabled={markers.length === 0}
          className={`mt-4 py-2 px-4 rounded-lg font-medium ${
            markers.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-500 hover:bg-black text-white'
          }`}
        >
          Submit Checklist
        </button>
      </div>

      {/* Modal to add marker description */}
      <MarkerDescriptionModal
        show={showModal}
        description={description}
        setDescription={setDescription}
        onSave={handleSaveMarker}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ImageMarkerComponent;