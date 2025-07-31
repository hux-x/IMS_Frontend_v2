import { useState } from "react";
import { 
  FaPlus, 
  FaUserFriends, 
  FaStar, 
  FaBullhorn, 
  FaShieldAlt, 
  FaIdCard,
  FaChevronRight
} from "react-icons/fa";
import InputField from "@/components/custom/InputField";
import Dropdown from "@/components/custom/Dropdown";

const CreateEmployeeModal = ({ onAddEmployee, isAddEmployeeModalOpen, setIsAddEmployeeModalOpen }) => {
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    department: "",
    email: "",
    password: "",
    status: "Non Active" // Default status
  });
  
  const [errors, setErrors] = useState({});
  
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
  const statusOptions = ["Active", "Non Active"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      username: formData.name+"-x", 
      email: formData.email,
      password: formData.password,
      role: formData.role.toLowerCase(),
      department: formData.department,
      status: formData.status,
      name: formData.name
    };

    onAddEmployee(payload);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
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

  if (!isAddEmployeeModalOpen) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-[680px] " >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaUserFriends className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-black">Create Employee</h2>
        </div>
        <button 
          onClick={() => setIsAddEmployeeModalOpen(false)} 
          className="hover:bg-gray-100 p-1 rounded" 
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
              placeholder="Any name" 
              
              name="name"
              value={formData.name}
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

        {/* Email and Password */}
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
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button 
            type="submit"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-700 text-white font-semibold text-xs hover:bg-red-800 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployeeModal;