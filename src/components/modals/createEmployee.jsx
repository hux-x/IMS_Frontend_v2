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
  mode = "add",
  employeeData = null,
  availableRoles = []
}) => {
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    department: "",
    email: "",
    password: "",
    age: "",
    status: "active",
    username: "",
    startTime: "",
    endTime: "",
    CNIC: "",
    emergencyContact: "",
    address: "",
    contact: "",
    permissions: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
        password: "",
        age: employeeData.age?.toString() || "",
        status: employeeData.status?.toLowerCase() || "active",
        username: employeeData.username || "",
        startTime: employeeData.work_shift?.startTime || "",
        endTime: employeeData.work_shift?.endTime || "",
        CNIC: employeeData.CNIC || "",
        emergencyContact: employeeData.emergencyContact || "",
        address: employeeData.address || "",
        contact: employeeData.contact || "",
        permissions: employeeData.permissions || []
      });
    } else if (mode === "add") {
      setFormData({
        role: "",
        name: "",
        department: "",
        email: "",
        password: "",
        age: "",
        status: "active",
        username: "",
        startTime: "",
        endTime: "",
        CNIC: "",
        emergencyContact: "",
        address: "",
        contact: "",
        permissions: []
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
        age: parseInt(formData.age) || 25,
        startTime: formData.startTime,
        endTime: formData.endTime,
        CNIC: formData.CNIC,
        emergencyContact: formData.emergencyContact,
        address: formData.address,
        contact: formData.contact,
        permissions: formData.permissions
      };

      if (mode === "edit") {
        const updatePayload = { ...payload };
        if (!updatePayload.password?.trim()) {
          delete updatePayload.password;
        }
        await onUpdateEmployee(employeeData._id, updatePayload);
        console.log(updatePayload)
      } else {
        await onAddEmployee(payload);
      }
      
      setFormData({
        role: "",
        name: "",
        department: "",
        email: "",
        password: "",
        age: "",
        status: "active",
        username: "",
        startTime: "",
        endTime: "",
        CNIC: "",
        emergencyContact: "",
        address: "",
        contact: "",
        permissions: []
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
    
    if (mode === "add" && !formData.password?.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password?.trim() && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.age && (isNaN(formData.age) || parseInt(formData.age) < 18 || parseInt(formData.age) > 100)) {
      newErrors.age = "Age must be between 18 and 100";
    }

    // CNIC validation (Pakistani format: XXXXX-XXXXXXX-X)
    if (formData.CNIC && !/^\d{5}-?\d{7}-?\d{1}$/.test(formData.CNIC.replace(/-/g, ''))) {
      newErrors.CNIC = "Invalid CNIC format (13 digits)";
    }

    // Contact validation
    if (formData.contact && !/^\+?[\d\s-]{10,}$/.test(formData.contact)) {
      newErrors.contact = "Invalid contact number";
    }

    // Emergency contact validation
    if (formData.emergencyContact && !/^\+?[\d\s-]{10,}$/.test(formData.emergencyContact)) {
      newErrors.emergencyContact = "Invalid emergency contact";
    }

    // Time validation for 24-hour format
    if (formData.startTime && formData.endTime) {
      const start = formData.startTime;
      const end = formData.endTime;
      
      if (start >= end) {
        newErrors.endTime = "End time must be after start time";
      }
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
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
  };

  if (!isModalOpen) return null;

  const isEditMode = mode === "edit";
  const modalTitle = isEditMode ? "Update Employee" : "Create Employee";
  const submitButtonText = isEditMode ? "Update Employee" : "Add Employee";
  const submitButtonIcon = isEditMode ? <FaEdit className="w-4 h-4" /> : <FaPlus className="w-4 h-4" />;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-[680px] max-h-[90vh] overflow-y-auto">
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
        {/* Basic Information Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
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
            
            <div>
              <InputField 
                label="Username" 
                placeholder="Create a username" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>
            
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
            
            <Dropdown
              label="Status"
              placeholder="Select status"
              value={formData.status}
              options={statusOptions}
              onSelect={(value) => handleSelect("status", value)}
              error={errors.status}
              required
            />

            <div>
              <InputField 
                label="Age" 
                placeholder="Enter age" 
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

        {/* Contact Information Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputField 
                label="Email" 
                placeholder="example@gmail.com" 
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

            <div>
              <InputField 
                label="Contact Number" 
                placeholder="+92 300 1234567" 
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                type="tel"
              />
              {errors.contact && (
                <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
              )}
            </div>

            <div>
              <InputField 
                label="Emergency Contact" 
                placeholder="+92 300 1234567" 
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                type="tel"
              />
              {errors.emergencyContact && (
                <p className="text-red-500 text-xs mt-1">{errors.emergencyContact}</p>
              )}
            </div>

            <div>
              <InputField 
                label="CNIC" 
                placeholder="XXXXX-XXXXXXX-X" 
                name="CNIC"
                value={formData.CNIC}
                onChange={handleChange}
                type="text"
              />
              {errors.CNIC && (
                <p className="text-red-500 text-xs mt-1">{errors.CNIC}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <InputField 
              label="Address" 
              placeholder="Enter complete address" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              type="text"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>
        </div>

        {/* Work Schedule Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Work Schedule</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputField 
                label="Start Time" 
                placeholder="09:00" 
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                type="time"
              />
              {errors.startTime && (
                <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
              )}
            </div>

            <div>
              <InputField 
                label="End Time" 
                placeholder="17:00" 
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                type="time"
              />
              {errors.endTime && (
                <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Times are in 24-hour format (e.g., 09:00 for 9 AM, 17:00 for 5 PM)</p>
        </div>

        {/* Security Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Security</h3>
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