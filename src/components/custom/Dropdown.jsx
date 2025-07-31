import { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Dropdown = ({
  label,
  icon,
  placeholder,
  value,
  options,
  onSelect,
  error,
  required = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-base font-semibold text-black flex items-center gap-2 mb-1">
          {icon}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className={`bg-gray-50 px-4 py-3 rounded-xl text-xs font-semibold text-gray-500 w-full cursor-pointer border ${
            error ? "border-red-500" : "border-gray-200"
          }`}
          value={value}
          onClick={toggleDropdown}
          readOnly
        />
        {isOpen ? (
          <FaChevronUp
            className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
            onClick={toggleDropdown}
          />
        ) : (
          <FaChevronDown
            className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
            onClick={toggleDropdown}
          />
        )}
        
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm capitalize"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;