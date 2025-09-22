import { useRef } from 'react';
import { FaEdit } from 'react-icons/fa';

export default function ReusableTable({ 
  data, 
  currentPage, 
  itemsPerPage, 
  onPageChange,
  columns,
  editItem  = () => { console.log("Edit item function not provided"); }
  
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
          <col className="w-[10%]" />
        </colgroup>
        <thead>
          <tr className="h-[2.625rem] bg-[#F3F4F6] sticky top-0">
            {
              columns?.map((column, index) => (
                <th key={index} className="p-3 text-left font-medium">
                  {column}
                </th>
              ))
            }
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr
              key={item.id}
              className="h-[3.5625rem] bg-white border-b border-gray-200"
            >
              <td className="p-3">
                {item.name}
              </td>
              <td className="p-3 font-semibold">
                {item.department}
              </td>
              <td className="p-3">
                {item.taskid? item.taskid : item.role}
              </td>
              <td className="p-3">
                <div className={`flex justify-center items-center w-[7.75rem] h-[2.0625rem] px-[0.625rem] py-[0.125rem] rounded-[0.625rem] ${
                  item.status === 'active' || item.status === true
                    ? 'bg-[#DEF7EC] text-[#03543F]'
                    : 'bg-[#FDE8E8] text-[#9B1C1C]'
                }`}>
                  <span className="text-sm font-semibold leading-5 text-center">
                    {item.status}
                  </span>
                </div>
              </td>
              <td className="p-3 text-right">
                <button 
                  onClick={() => editItem()}
                  className="w-[6.75rem] h-[2.375rem] px-[0.6875rem] py-[0.4375rem] bg-[rgb(139,184,134)] rounded-[0.75rem] flex items-center justify-center gap-2 shadow ml-auto"
                >
                    <FaEdit className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-semibold leading-5">Edit Item</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}