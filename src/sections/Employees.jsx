import { useState, useEffect, useContext } from 'react';
import { employees } from '@/mockData/employees';
import CreateEmployeeModal from '@/components/modals/createEmployee';
import EmployeeTable from '@/components/layout/ReuableTable';

import { FaPlus, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useAuth from '@/hooks/useAuth';

export default function EmployeeList() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const columns = ["EMPLOYEE NAME", "DEPARTMENT", "ROLE","STATUS"];
  const itemsPerPage = 13;
  const [isAddEmployeeModalOpen,setIsAddEmployeeModalOpen] = useState(false);
  const [employeeData,setEmployeeData] = useState([]);
  const {getEmployees} = useAuth()
  useEffect(()=>{
    const fetchEmployees = async () => {
      try {
        const response = await getEmployees(100, 0); // Fetch 100 employees starting from offset 0
        if (response && response.data) {
          setEmployeeData(response.data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees(); 
  },[])

  const handleAddEmployee = (newEmployee) => {
    setEmployeeData(prev => [...prev, newEmployee]);
  };

  useEffect(() => {
    if(employeeData?.length === 0) {
      setEmployeeData(employees);
    }
  }, [employeeData, setEmployeeData]);

  // Filter data based on search
  const filteredData = employeeData?.filter(item =>
    item?.name?.toLowerCase().includes(search.toLowerCase())
  );

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
  const handleEditEmployee = ()=>{
    setIsEditModalOpen(true);
  }

  return (
    <div className="w-[calc(100%-1rem)] min-h-screen bg-[#F9FAFB] pt-0 pl-0 flex flex-col relative mt-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 flex-wrap gap-4 px-10 pt-0 ">
        <div className="relative w-full sm:w-[25.125rem] ml-4 ">
          <div className="relative ">
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
            className="flex items-center justify-center gap-2 w-[174px] h-[44px] px-[11px] bg-[#C81E1E] rounded-[12px] hover:bg-[#B81E1E] transition-colors"
            onClick={openAddEmployeeModal}
          >
            <FaPlus
             
              className="w-[23px] h-[23px] text-white" 
            />
            <span className="text-[12px] font-semibold text-white">
              Add Employee
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
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>
      </div>

      {/* Table Component */}
      <EmployeeTable 
        data={filteredData} 
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
            className="absolute inset-0 "
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={closeAddEmployeeModal}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all">
            <CreateEmployeeModal 
              onAddEmployee={handleAddEmployee} 
              isAddEmployeeModalOpen={isAddEmployeeModalOpen}
              setIsAddEmployeeModalOpen={setIsAddEmployeeModalOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
}