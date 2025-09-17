// File: src/components/ImageMarker.jsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, Download, Check } from 'lucide-react';

const ImageMarker = ({ imageFile, onSave, onClose }) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [checklist, setChecklist] = useState(['']);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (imageFile) {
      loadImage(imageFile);
    }
  }, [imageFile]);

  const loadImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        // Calculate canvas size to fit the container while maintaining aspect ratio
        const maxWidth = 800;
        const maxHeight = 600;
        
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        setCanvasSize({ width, height });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      drawCanvas();
    }
  }, [image, markers, canvasSize]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(image, 0, 0, canvasSize.width, canvasSize.height);
    
    // Draw markers
    markers.forEach((marker, index) => {
      drawMarker(ctx, marker.x, marker.y, index + 1, marker.id === selectedMarker);
    });
  };

  const drawMarker = (ctx, x, y, number, isSelected) => {
    const radius = 15;
    
    // Draw circle background
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isSelected ? '#ef4444' : '#000000';
    ctx.fill();
    
    // Draw white border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number.toString(), x, y);
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on existing marker
    const clickedMarker = markers.find(marker => {
      const distance = Math.sqrt((marker.x - x) ** 2 + (marker.y - y) ** 2);
      return distance <= 15;
    });

    if (clickedMarker) {
      setSelectedMarker(clickedMarker.id);
    } else {
      // Add new marker
      const newMarker = {
        id: Date.now(),
        x,
        y
      };
      setMarkers([...markers, newMarker]);
      setChecklist([...checklist, '']);
      setSelectedMarker(newMarker.id);
    }
  };

  const handleChecklistChange = (index, value) => {
    const newChecklist = [...checklist];
    newChecklist[index] = value;
    setChecklist(newChecklist);
  };

  const addChecklistItem = () => {
    setChecklist([...checklist, '']);
    // Add marker at center if no markers exist
    if (markers.length === checklist.length) {
      const newMarker = {
        id: Date.now(),
        x: canvasSize.width / 2,
        y: canvasSize.height / 2
      };
      setMarkers([...markers, newMarker]);
    }
  };

  const removeChecklistItem = (index) => {
    const newChecklist = checklist.filter((_, i) => i !== index);
    const newMarkers = markers.filter((_, i) => i !== index);
    setChecklist(newChecklist);
    setMarkers(newMarkers);
    setSelectedMarker(null);
  };

  const removeMarker = (markerId) => {
    const markerIndex = markers.findIndex(m => m.id === markerId);
    if (markerIndex !== -1) {
      removeChecklistItem(markerIndex);
    }
  };

  const createMarkedImage = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas to original image size
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      
      // Calculate scale factors
      const scaleX = image.naturalWidth / canvasSize.width;
      const scaleY = image.naturalHeight / canvasSize.height;
      
      // Draw original image
      ctx.drawImage(image, 0, 0);
      
      // Draw markers at scaled positions
      markers.forEach((marker, index) => {
        const scaledX = marker.x * scaleX;
        const scaledY = marker.y * scaleY;
        const scaledRadius = 15 * Math.min(scaleX, scaleY);
        
        // Draw marker
        ctx.beginPath();
        ctx.arc(scaledX, scaledY, scaledRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#000000';
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2 * Math.min(scaleX, scaleY);
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${12 * Math.min(scaleX, scaleY)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((index + 1).toString(), scaledX, scaledY);
      });
      
      canvas.toBlob(resolve, 'image/png');
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const markedImageBlob = await createMarkedImage();
      const markedImageFile = new File([markedImageBlob], `marked_${imageFile.name}`, {
        type: 'image/png'
      });
      
      // Format checklist with numbers
      const formattedChecklist = checklist
        .filter(item => item.trim() !== '')
        .map((item, index) => `${index + 1}- ${item}`);
      
      onSave(markedImageFile, formattedChecklist);
    } catch (error) {
      console.error('Error creating marked image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadMarkedImage = async () => {
    try {
      const markedImageBlob = await createMarkedImage();
      const url = URL.createObjectURL(markedImageBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marked_${imageFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Mark Image</h3>
            <p className="text-sm text-gray-600">Click on the image to add markers</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadMarkedImage}
              className="p-2 text-gray-600 hover:text-black rounded-lg hover:bg-gray-100"
              title="Download marked image"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-80px)]">
          {/* Image Canvas */}
          <div className="flex-1 p-4 flex items-center justify-center bg-gray-50">
            {image ? (
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="border border-gray-300 rounded-lg cursor-crosshair shadow-lg"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : (
              <div className="text-gray-500">Loading image...</div>
            )}
          </div>

          {/* Checklist Panel */}
          <div className="w-80 border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900">Checklist Items</h4>
              <p className="text-xs text-gray-600 mt-1">Each marker corresponds to a checklist item</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {checklist.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Marker {index + 1}
                    </span>
                    {markers[index] && (
                      <button
                        onClick={() => removeMarker(markers[index].id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove marker and item"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={item}
                    onChange={(e) => handleChecklistChange(index, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    placeholder={`Description for marker ${index + 1}`}
                    rows={2}
                  />
                </div>
              ))}
              
              <button
                onClick={addChecklistItem}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-sm text-gray-600 hover:text-black hover:border-gray-400 transition-colors flex items-center justify-center"
              >
                <Plus size={16} className="mr-2" />
                Add Checklist Item
              </button>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              <button
                onClick={handleSave}
                disabled={isLoading || checklist.every(item => item.trim() === '')}
                className="w-full bg-black text-white rounded-xl py-2 px-4 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check size={16} className="mr-2" />
                    Save & Continue
                  </>
                )}
              </button>
              
              <button
                onClick={onClose}
                className="w-full border border-gray-300 text-gray-700 rounded-xl py-2 px-4 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageMarker;