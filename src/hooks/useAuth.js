import { useState, useEffect, useCallback } from "react";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext"; // Correct import from context
import authService from "@/apis/services/authService";

const useAuth = () => {
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all employees
  const getEmployees = useCallback(async (limit = 10, offset = 0) => {
    if (!isAuthenticated || !userId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getAllEmployees();
      setEmployees(response.data.employees || []);
      console.log(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  // Add employee
  const addEmployee = useCallback(async (employee) => {
    if (!isAuthenticated || !userId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await authService.registerEmployee(
        employee.name,
        employee.username,
        employee.age,
        employee.role,
        employee.position,
        employee.password
      );
      setEmployees((prev) => [...prev, response.data]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  // Update employee
  const updateEmployee = useCallback(async (id, updates) => {
    if (!isAuthenticated || !userId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await authService.updateEmployeeInfo(
        id,
        updates.name,
        updates.username,
        updates.age,
        updates.role,
        updates.position
      );
      setEmployees((prev) =>
        prev.map((e) => (e._id === id ? response.data.employee : e))
      );
    } catch (err) {
      setError(err);
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
      } catch (err) {
        setError(err);
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