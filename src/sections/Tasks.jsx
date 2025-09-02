// File: src/sections/Tasks.jsx
import TaskCard from '@/components/cards/TaskCard';
import CreateTask from '@/components/modals/createTask';
import ModalButton from '@/components/custom/ModalButton';
import { FaAngleLeft, FaAngleRight, FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa';
import useTasks from '@/hooks/useTask';


const Tasks = () => {

  const {tasks,
    loading,
    showCreateTask,
    setShowCreateTask,
    filters,
    setFilters,
    assignees,
    paginationParams,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    addTask,
    handleUpdateTask,
    handleDeleteTask
  } = useTasks()
  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Task Management</h2>
        <ModalButton 
          text={"Create Task"} 
          onCreate={addTask} 
          className={"bg-black text-white px-4 py-2 rounded hover:opacity-90"} 
          Modal={CreateTask}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 items-center flex-wrap">
        <select
          value={filters.status}
          onChange={(e) => {
            setFilters(prev => ({ ...prev, status: e.target.value }));
            setPaginationParams(prev => ({ ...prev, pageNumber: 1 }));
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Status</option>
          <option value="started">Not Started</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
          <option value="dueToday">Due Today</option>
          <option value="dueThisWeek">Due This Week</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => {
            setFilters(prev => ({ ...prev, priority: e.target.value }));
            setPaginationParams(prev => ({ ...prev, pageNumber: 1 }));
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={filters.assignee}
          onChange={(e) => {
            setFilters(prev => ({ ...prev, assignee: e.target.value }));
            setPaginationParams(prev => ({ ...prev, pageNumber: 1 }));
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Assignees</option>
          {assignees.map((assignee) => (
            <option key={assignee._id || assignee.id} value={assignee._id || assignee.id}>
              {assignee.name}
            </option>
          ))}
        </select>

        {/* Pagination Controls */}
        <div className="flex gap-2 items-center ml-auto">
          <button
            onClick={goToPreviousPage}
            disabled={paginationParams.pageNumber === 1 || loading}
            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaAngleDoubleLeft size={18} />
          </button>
          
        

          <span className="px-4 py-2 border rounded bg-gray-50">
            Page {paginationParams.pageNumber} of {paginationParams.maxPages}
          </span>

       

          <button
            onClick={goToNextPage}
            disabled={paginationParams.pageNumber === paginationParams.maxPages || loading}
            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaAngleDoubleRight size={18} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Task Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No tasks found. Create your first task to get started!
            </div>
          )}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTask
          onClose={() => setShowCreateTask(false)}
          onCreate={addTask}
          
        />
      )}
    </div>
  );
};

export default Tasks;
