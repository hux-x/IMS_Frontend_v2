import { useState, useEffect } from 'react';
import CreateEmployeeModal from '@/components/modals/createEmployee';
import EmployeeTable from '@/components/layout/ReuableTable';
import { FaPlus, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useAuth from '@/hooks/useAuth';

export default function EmployeeList() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  
  const columns = ["EMPLOYEE NAME", "DEPARTMENT", "ROLE", "STATUS"];
  const itemsPerPage = 13;
  
  const { 
    employees, 
    loading, 
    error, 
    getEmployees, 
    addEmployee 
  } = useAuth();

  // Load employees on component mount
  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  const handleAddEmployee = async (newEmployeeData) => {
    try {
      // Map the form data to match the API expected format
      const employeePayload = {
        name: newEmployeeData.name,
        username: newEmployeeData.username,
        age: newEmployeeData.age || 25,
        role: newEmployeeData.role.toLowerCase(),
        position: newEmployeeData.department, // Map department to position
        password: newEmployeeData.password,
        email: newEmployeeData.email,
        department: newEmployeeData.department, 
        contact: newEmployeeData.contact || '', // Optional field
        team: null // Optional field
      };

      await addEmployee(employeePayload);
      setIsAddEmployeeModalOpen(false);
      
      // Show success message (you can replace this with your preferred notification system)
      alert('Employee added successfully!');
    } catch (err) {
      console.error('Error adding employee:', err);
      alert('Failed to add employee. Please try again.');
    }
  };

  // Filter employees based on search
  const filteredData = employees?.filter(employee =>
    employee?.name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Open add employee modal
  const openAddEmployeeModal = () => {
    setIsAddEmployeeModalOpen(true);
  };

  // Close modals
  const closeAddEmployeeModal = () => {
    setIsAddEmployeeModalOpen(false);
  };

  const handleEditEmployee = () => {
    // Implement edit functionality later
    console.log('Edit employee clicked');
  };

  // Transform employee data to match table expected format
  const transformedData = filteredData.map(employee => ({
    id: employee._id,
    name: employee.name,
    department: employee.position || 'N/A',
    role: employee.role,
    status: employee.status || 'Active'
  }));

  if (loading && employees.length === 0) {
    return (
      <div className="w-[calc(100%-1rem)] min-h-screen bg-[#F9FAFB] pt-0 pl-0 flex flex-col relative mt-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading employees...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[calc(100%-1rem)] min-h-screen bg-[#F9FAFB] pt-0 pl-0 flex flex-col relative mt-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">
            Error loading employees: {error.message || 'Something went wrong'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[calc(100%-1rem)] min-h-screen bg-[#F9FAFB] pt-0 pl-0 flex flex-col relative mt-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 flex-wrap gap-4 px-10 pt-0">
        <div className="relative w-full sm:w-[25.125rem] ml-4">
          <div className="relative">
            <FaSearch
              alt="Search" 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4" 
            />
            <input
              type="text"
              placeholder="Search Employees by name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-[2.8125rem] pl-10 pr-[0.9375rem] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[1rem] text-base font-normal text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#E5E7EB]"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button 
            className="flex items-center justify-center gap-2 w-[174px] h-[44px] px-[11px] bg-[#C81E1E] rounded-[12px] hover:bg-[#B81E1E] transition-colors disabled:opacity-50"
            onClick={openAddEmployeeModal}
            disabled={loading}
          >
            <FaPlus className="w-[23px] h-[23px] text-white" />
            <span className="text-[12px] font-semibold text-white">
              {loading ? 'Loading...' : 'Add Employee'}
            </span>
          </button>
          <div className="flex items-center gap-2">
            <button 
              className="w-6 h-6 flex items-center justify-center disabled:opacity-50"
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft size={16} className="w-6 h-6" />
            </button>
            <button 
              className="w-6 h-6 flex items-center justify-center disabled:opacity-50"
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight size={16} className="w-6 h-6" />
            </button>
            <span className="text-xs font-semibold text-[#6B7280]">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>
        </div>
      </div>

      {/* Employee count */}
      <div className="px-10 mb-4">
        <span className="text-sm text-gray-600">
          {filteredData.length} employee{filteredData.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Table Component */}
      <EmployeeTable 
        data={transformedData} 
        currentPage={currentPage} 
        itemsPerPage={itemsPerPage} 
        onPageChange={paginate} 
        columns={columns}
        editItem={handleEditEmployee}
      />

      {/* Add Employee Modal */}
      {isAddEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={closeAddEmployeeModal}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all">
            <CreateEmployeeModal 
              onAddEmployee={handleAddEmployee} 
              isAddEmployeeModalOpen={isAddEmployeeModalOpen}
              setIsAddEmployeeModalOpen={setIsAddEmployeeModalOpen}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}