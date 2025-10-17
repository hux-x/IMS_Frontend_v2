import { useState, useEffect, useCallback } from "react";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import authService from "@/apis/services/authService";

const useAuth = () => {
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all employees
  const getEmployees = useCallback(async () => {
    if (!isAuthenticated || !userId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getAllEmployees();
      setEmployees(response.data.employees || []);
      console.log(response.data);
    } catch (err) {
      setError(err);
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  // Add employee - Updated to match backend API
  const addEmployee = useCallback(async (employeeData) => {
    if (!isAuthenticated || !userId) return;
    try {
      setLoading(true);
      setError(null);
      
      // Call the API with all required fields
      const response = await authService.registerEmployee({
        name: employeeData.name,
        username: employeeData.username,
        age: employeeData.age,
        role: employeeData.role,
        position: employeeData.position,
        password: employeeData.password,
        email: employeeData.email,
        department: employeeData.department,
        contact: employeeData.contact || '',
        team: employeeData.team || null
      });
      
      // Add the new employee to the state
      if (response.data) {
        // Refresh the employees list to get the latest data
        await getEmployees();
      }
      
      return response;
    } catch (err) {
      setError(err);
      console.error('Error adding employee:', err);
      throw err; // Re-throw to handle in component
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId, getEmployees]);

  // Update employee
  const updateEmployee = useCallback(async (id, updates) => {
    if (!isAuthenticated || !userId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await authService.updateEmployeeInfo(id, updates);
      
      // Update the employee in the state
      setEmployees((prev) =>
        prev.map((e) => (e._id === id ? response.data.employee : e))
      );
      
      return response;
    } catch (err) {
      setError(err);
      console.error('Error updating employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  // Delete employee
  const deleteEmployee = useCallback(async (id) => {
    if (!isAuthenticated || !userId) return;
    try {
      setLoading(true);
      setError(null);
      await authService.deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setError(err);
      console.error('Error deleting employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  const getFilteredEmployees = useCallback(
    async ({ limit = 10, offset = 0, role, position, status, available }) => {
      if (!isAuthenticated || !userId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await authService.getFilteredEmployees(
          limit,
          offset,
          role,
          position,
          status,
          available
        );
        setFilteredEmployees(res.data.employees || []);
        return res;
      } catch (err) {
        setError(err);
        console.error('Error fetching filtered employees:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, userId]
  );

  // Load employees after authentication
  useEffect(() => {
    if (isAuthenticated && userId) {
      getEmployees();
    }
  }, [isAuthenticated, userId, getEmployees]);

  return {
    employees,
    loading,
    error,
    filteredEmployees,
    getFilteredEmployees,
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
};

export default useAuth;