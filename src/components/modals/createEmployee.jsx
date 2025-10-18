import { useState, useEffect } from "react";
import { 
  FaPlus, 
  FaUserFriends, 
  FaBullhorn, 
  FaChevronRight,
  FaEdit
} from "react-icons/fa";
import InputField from "@/components/custom/InputField";
import Dropdown from "@/components/custom/Dropdown";

const EmployeeModal = ({ 
  onAddEmployee,
  onUpdateEmployee,
  isModalOpen, 
  setIsModalOpen,
  loading = false,
  mode = "add", // "add" or "edit"
  employeeData = null, // Employee data for edit mode
  availableRoles = [] // Roles provided by API
}) => {
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    department: "",
    email: "",
    password: "",
    age: "",
    status: "active",
    username: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use roles from API, with fallback to default roles
  const roles = availableRoles && availableRoles.length > 0 
    ? availableRoles 
    : ["employee", "intern", "admin", "executive"];
  
  const departments = [
    "Technology",
    "Human Resources", 
    "Finance",
    "Marketing",
    "Operations",
    "Sales",
    "Customer Support"
  ];
  
  const statusOptions = ["active", "inactive"];

  // Populate form data when in edit mode
  useEffect(() => {
    if (mode === "edit" && employeeData) {
      setFormData({
        role: employeeData.role || "",
        name: employeeData.name || "",
        department: employeeData.department || employeeData.position || "",
        email: employeeData.email || "",
        password: "", // Don't populate password for security
        age: employeeData.age?.toString() || "",
        status: employeeData.status?.toLowerCase() || "active",
        username: employeeData.username || ""
      });
    } else if (mode === "add") {
      // Reset form for add mode
      setFormData({
        role: "",
        name: "",
        department: "",
        email: "",
        password: "",
        age: "",
        status: "active",
        username: ""
      });
    }
    setErrors({});
  }, [mode, employeeData, isModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role.toLowerCase(),
        position: formData.role.toLowerCase(),
        department: formData.department,
        status: formData.status.toLowerCase(),
        name: formData.name,
        age: parseInt(formData.age) || 25
      };

      if (mode === "edit") {
        // For update, exclude password if empty
        const updatePayload = { ...payload };
        if (!updatePayload.password?.trim()) {
          delete updatePayload.password;
        }
        await onUpdateEmployee(employeeData._id, updatePayload);
      } else {
        // For add, include password (required)
        await onAddEmployee(payload);
      }
      
      // Reset form after successful submission
      setFormData({
        role: "",
        name: "",
        department: "",
        email: "",
        password: "",
        age: "",
        status: "active",
        username: ""
      });
      setErrors({});
      
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    // Password validation - required for add mode, optional for edit mode
    if (mode === "add" && !formData.password?.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password?.trim() && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.age && (isNaN(formData.age) || parseInt(formData.age) < 18 || parseInt(formData.age) > 100)) {
      newErrors.age = "Age must be between 18 and 100";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user selects
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing while submitting
    setIsModalOpen(false);
  };

  if (!isModalOpen) return null;

  const isEditMode = mode === "edit";
  const modalTitle = isEditMode ? "Update Employee" : "Create Employee";
  const submitButtonText = isEditMode ? "Update Employee" : "Add Employee";
  const submitButtonIcon = isEditMode ? <FaEdit className="w-4 h-4" /> : <FaPlus className="w-4 h-4" />;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-[680px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaUserFriends className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-black">{modalTitle}</h2>
        </div>
        <button 
          onClick={handleClose}
          disabled={isSubmitting}
          className="hover:bg-gray-100 p-1 rounded disabled:opacity-50" 
        >
          <FaChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <hr className="border border-gray-200 mb-6" />

      <form onSubmit={handleSubmit} noValidate>
        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          {/* Role Dropdown */}
          <Dropdown
            label="Role"
            icon={<FaUserFriends className="w-4 h-4 text-gray-600" />}
            placeholder="Select role"
            value={formData.role}
            options={roles}
            onSelect={(value) => handleSelect("role", value)}
            error={errors.role}
            required
          />

          {/* Employee Name */}
          <div>
            <InputField 
              label="Employee Name" 
              placeholder="Enter full name" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          
          {/* Username */}
          <div>
            <InputField 
              label="Username" 
              placeholder="Create a username (unique)" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
          
          {/* Department Dropdown */}
          <Dropdown
            label="Department"
            icon={<FaBullhorn className="w-4 h-4 text-gray-600" />}
            placeholder="Select department"
            value={formData.department}
            options={departments}
            onSelect={(value) => handleSelect("department", value)}
            error={errors.department}
            required
          />
          
          {/* Status Dropdown */}
          <Dropdown
            label="Status"
            placeholder="Select status"
            value={formData.status}
            options={statusOptions}
            onSelect={(value) => handleSelect("status", value)}
            error={errors.status}
            required
          />
        </div>

        {/* Email, Password, and Age */}
        <div className="flex flex-col gap-4">
          <div>
            <InputField 
              label="Email" 
              placeholder="Eg. example@gmail.com" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputField 
                label={isEditMode ? "Password (leave blank to keep current)" : "Password"} 
                placeholder={isEditMode ? "Enter new password (optional)" : "Enter password (min 6 characters)"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required={!isEditMode}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            
            <div>
              <InputField 
                label="Age" 
                placeholder="Enter age (optional)" 
                name="age"
                value={formData.age}
                onChange={handleChange}
                type="number"
                min="18"
                max="100"
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button 
            type="submit"
            disabled={isSubmitting || loading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-700 text-white font-semibold text-xs hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitButtonIcon}
            {isSubmitting ? 
              (isEditMode ? 'Updating Employee...' : 'Adding Employee...') : 
              submitButtonText
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeModal;