import { useState, useEffect, useCallback } from "react";
import authService from "@/apis/services/authService";

const useAuth = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all employees
  const getEmployees = useCallback(async (limit, offset) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getEmployees(limit, offset);
      setEmployees(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add employee
  const addEmployee = useCallback(async (employee) => {
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
  }, []);

  // Update employee
  const updateEmployee = useCallback(async (id, updates) => {
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
        prev.map((e) => (e.id === id ? response.data : e))
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete employee
  const deleteEmployee = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await authService.deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getFilteredEmployees = useCallback(
  async ({ limit, offset, role, position, status, available }) => {
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
      setFilteredEmployees(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  },
  []
);


  // Load employees on mount
  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

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
