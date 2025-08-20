import { useState, useCallback } from "react";
import taskService from "@/apis/services/taskService";
const PAGE_SIZE = 15;
const useTask = () => {

  const [allTasks, setAllTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState({
    type: "allTasks",               //enum: [allTasks,myTasks] 
    filters: [],
    tasks: [],
  });


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [paginationParams,setPaginationParams] = useState({taskType:'all',page:1,isRefresh:true})
  const [maxPages,setMaxPages] = useState();
  const [isRefreshing,setIsRefreshing] = useState(true) //will be used for shimmers (when navigating to the next page)


  const onRefresh = useCallback(()=>{
    if(!loading){
      setPaginationParams((prev)=>{
       return{
        taskType:prev.taskType,
        page:1,
        isRefresh:true
       } 
      })
    }
  })

  const navigateToNextPage = useCallback((taskType)=>{

    if(!loading && paginationParams.page < maxPages){
      setPaginationParams((prev)=>{
        return {
          taskType: taskType,
          page: prev.page+1,
          isRefresh: true
        }
      })
    }
    
  })

  const navigateToPreviousPage = useCallback(()=>{
      if(!loading && !paginationParams.page <= 1){
      setPaginationParams((prev)=>{
        return {
          taskType: prev.taskType,
          page: prev.page-1,
          isRefresh: true
        }
      })
    }
  })


  const getAllTasks = useCallback(async (limit = 10, offset = 0) => { //for admin -- fetches all available in the database 
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.getAllTasks(limit, offset)
      console.log(res)
      setAllTasks(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyTasks = useCallback(async (limit = 10, offset = 0) => { // all tasks but for employee -- fethces all tasks of that employee 
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.getMyTasks(limit, offset);
      console.log(res)
      setMyTasks(res.data);
      let pages = 0;
      if(res.data.total%PAGE_SIZE == 0){
        pages = res.data.total/PAGE_SIZE
      }else{
        pages = res.data.total/PAGE_SIZE + 1;
      }
      setMaxPages(pages)
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (task) => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.createTask(task);
      setAllTasks(prev => [...prev, res.data]);
      if (task.assignedToMe) setMyTasks(prev => [...prev, res.data]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (taskId, updates) => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.updateTask(taskId, updates);
      const updateList = list => list.map(t => t.id === taskId ? res.data : t);
      setAllTasks(updateList);
      setMyTasks(updateList);
      setAssignedTasks(updateList);
      setBacklogTasks(updateList);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.deleteTask(taskId);
      const filterList = list => list.filter(t => t.id !== taskId);
      setAllTasks(filterList);
      setMyTasks(filterList);
      setAssignedTasks(filterList);
      setBacklogTasks(filterList);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getFilteredTasks = useCallback(async ( limit = 10, offset = 0, status = null, priority = null,type ) => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.filteredTasks(limit, offset, status, priority);
      setFilteredTasks({
        type: type,
        filters: [status, priority],
        tasks: res.data.tasks,
      });
      setPaginationParams((prev)=>{
        return {

        }
      })
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filteredTasks.filters, filteredTasks.type, paginationParams.taskType,paginationParams.page]);
  

  return {
    allTasks,
    myTasks,
    loading,
    error,
    filteredTasks,
    getAllTasks,
    getMyTasks,
    addTask,
    updateTask,
    deleteTask,
    getFilteredTasks
  };
};

export default useTask;
