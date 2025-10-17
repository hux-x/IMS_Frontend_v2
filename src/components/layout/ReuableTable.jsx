import { useRef } from 'react';
import { FaEdit } from 'react-icons/fa';

export default function ReusableTable({ 
  data, 
  currentPage, 
  itemsPerPage, 
  onPageChange,
  columns,
  editItem = () => { console.log("Edit item function not provided"); },
  showEditButton = true // New prop to control edit button visibility
}) {
  const tableContainerRef = useRef(null);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    onPageChange(pageNumber);
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo(0, 0);
    }
  };

  const handleEditClick = (item) => {
    console.log('Edit clicked for item:', item);
    editItem(item);
  };

  return (
    <div 
      ref={tableContainerRef}
      className="flex-1 w-full overflow-x-auto px-10 pb-6 overflow-y-hidden"
    >
      <table className="w-full min-w-[500px]">
        <colgroup>
          <col className="w-[25%]" />
          <col className="w-[25%]" />
          <col className="w-[25%]" />
          <col className="w-[15%]" />
          {showEditButton && <col className="w-[10%]" />}
        </colgroup>
        <thead>
          <tr className="h-[2.625rem] bg-[#F3F4F6] sticky top-0">
            {columns?.map((column, index) => (
              <th key={index} className="p-3 text-left font-medium">
                {column}
              </th>
            ))}
            {showEditButton && <th className="p-3 text-center font-medium">ACTION</th>}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr
              key={item.id}
              className="h-[3.5625rem] bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="p-3">
                <div className="font-medium text-gray-900">
                  {item.name}
                </div>
              </td>
              <td className="p-3 font-semibold text-gray-700">
                {item.department}
              </td>
              <td className="p-3 text-gray-600">
                {item.taskid ? item.taskid : item.role}
              </td>
              <td className="p-3">
                <div className={`inline-flex justify-center items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  item.status === 'active' || item.status === 'Active' || item.status === true
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {typeof item.status === 'boolean' 
                    ? (item.status ? 'Active' : 'Inactive')
                    : item.status
                  }
                </div>
              </td>
              {showEditButton && (
                <td className="p-3">
                  <div className="flex justify-center">
                    <button 
                      onClick={() => handleEditClick(item)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      title={`Edit ${item.name}`}
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
          
          {/* Empty state */}
          {currentItems.length === 0 && (
            <tr>
              <td 
                colSpan={showEditButton ? columns.length + 1 : columns.length}
                className="p-8 text-center text-gray-500"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="text-lg font-medium">No data found</div>
                  <div className="text-sm">Try adjusting your search or filters</div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}