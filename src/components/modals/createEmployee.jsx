import { useState } from "react";
import { 
  FaPlus, 
  FaUserFriends, 
  FaBullhorn, 
  FaChevronRight
} from "react-icons/fa";
import InputField from "@/components/custom/InputField";
import Dropdown from "@/components/custom/Dropdown";

const CreateEmployeeModal = ({ 
  onAddEmployee, 
  isAddEmployeeModalOpen, 
  setIsAddEmployeeModalOpen,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    department: "",
    email: "",
    password: "",
    age: "",
    status: "Active", // Default status
    username:""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const roles = ["employee", "intern", "admin", "executive"];
  const departments = [
    "Technology",
    "Human Resources", 
    "Finance",
    "Marketing",
    "Operations",
    "Sales",
    "Customer Support"
  ];
  const statusOptions = ["active", "Non Active"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Generate username from name if not provided
      const payload = {
        username_: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role.toLowerCase(),
        position: formData.role.toLowerCase(),
      
        department: formData.department, // This will be mapped to position in the parent
        status: formData.status,
        name: formData.name,
        age: parseInt(formData.age) || 25,
        username: formData.username
      };
      console.log(payload)
      const {name, username_, age, role, position, password,email,department,status, username} = payload;

      await onAddEmployee({name, username: username_, age, role, position, password,email,department,status, username});
      
      // Reset form after successful submission
      setFormData({
        role: "",
        name: "",
        department: "",
        email: "",
        password: "",
        age: "",
        contact: "",
        status: "Active"
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
    if (!formData.password?.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
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
    setIsAddEmployeeModalOpen(false);
  };

  if (!isAddEmployeeModalOpen) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-[680px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaUserFriends className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-black">Create Employee</h2>
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
            placeholder="Eg. Employee"
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
           <div>
            <InputField 
              label="Username" 
              placeholder="Create a username (unique)" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          
          {/* Department Dropdown */}
          <Dropdown
            label="Department"
            icon={<FaBullhorn className="w-4 h-4 text-gray-600" />}
            placeholder="Eg. Technology"
            value={formData.department}
            options={departments}
            onSelect={(value) => handleSelect("department", value)}
            error={errors.department}
            required
          />
          
          {/* Status Dropdown */}
          <Dropdown
            label="Status"
            placeholder="Eg. Active"
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
                label="Password" 
                placeholder="Enter password (min 6 characters)" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
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
            <FaPlus className="w-4 h-4" />
            {isSubmitting ? 'Adding Employee...' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployeeModal;