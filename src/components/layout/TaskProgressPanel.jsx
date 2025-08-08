
import React, { useState } from "react";
import ImageMarker from "react-image-marker";
import MarkerDescriptionModal from "@/components/modals/MarkerDescriptionModal";

const ImageMarkerComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState(null);

  const handleAddMarker = (marker) => {
    const newMarker = {
      ...marker,
      id: Date.now(),
      description: "",
    };
    setMarkers((prev) => [...prev, newMarker]);
  };

  const handleMarkerClick = (markerId) => {
    setActiveMarkerId(markerId);
    setShowModal(true);
  };

  const handleSaveDescription = (description) => {
    setMarkers((prev) =>
      prev.map((m) =>
        m.id === activeMarkerId ? { ...m, description } : m
      )
    );
    setShowModal(false);
    setActiveMarkerId(null);
  };

  // Custom blue dot marker
  const CustomMarker = ({ marker }) => {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation(); // prevent adding new marker when clicking existing one
          handleMarkerClick(marker.id);
        }}
        style={{
          width: "15px",
          height: "15px",
          backgroundColor: "blue",
          borderRadius: "50%",
          border: "2px solid white",
          cursor: "pointer",
        }}
      ></div>
    );
  };

  return (
    <div>
      <ImageMarker
        src="/your-image.jpg"
        markers={markers}
        onAddMarker={handleAddMarker}
        markerComponent={CustomMarker} // ✅ Use custom clickable marker
      />

      {showModal && (
        <MarkerDescriptionModal
          marker={markers.find((m) => m.id === activeMarkerId)}
          onSave={handleSaveDescription}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ImageMarkerComponent;
