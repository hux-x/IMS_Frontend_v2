import { useState, useEffect, useCallback } from "react";
import teamService from "@/apis/services/teamService";

const useTeam = () => {

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);w


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await teamService.getAllTeams();
      setTeams(res.data.teams);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);


  const getTeamById = useCallback(async (teamId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await teamService.getTeamById({ teamId });
      setSelectedTeam(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);


  const createTeam = useCallback(async ({ name, members: memberIds, teamLeadId }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await teamService.createTeam({ name, members: memberIds, teamLeadId });
      setTeams(prev => [...prev, res.data]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);


  const updateTeam = useCallback(async ({ teamId, name, teamLead }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await teamService.updateTeam({ teamId, name, teamLead });
      setTeams(prev => prev.map(t => t.id === teamId ? res.data : t));
      if (selectedTeam?.id === teamId) setSelectedTeam(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedTeam]);


  const deleteTeam = useCallback(async (teamId) => {
    try {
      setLoading(true);
      setError(null);
      await teamService.deleteTeam({ teamId });
      setTeams(prev => prev.filter(t => t.id !== teamId));
      if (selectedTeam?.id === teamId) setSelectedTeam(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedTeam]);


  const getTeamMembers = useCallback(async (teamId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await teamService.getTeamMembers({ teamId });
      setMembers(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTeamMember = useCallback(async ({ teamId, employeeId }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await teamService.addTeamMember({ teamId, employeeId });
      setMembers(prev => [...prev, res.data]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTeamMember = useCallback(async ({ teamId, employeeId }) => {
    try {
      setLoading(true);
      setError(null);
      await teamService.removeTeamMember({ teamId, employeeId });
      setMembers(prev => prev.filter(m => m.id !== employeeId));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMemberRole = useCallback(async ({ teamId, memberId, role }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await teamService.updateMemberRole({ teamId, memberId, role });
      setMembers(prev => prev.map(m => m.id === memberId ? res.data : m));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeamLead = useCallback(async (teamId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await teamService.getTeamLead({ teamId });
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllTeams();
  }, [getAllTeams]);

  return {
    teams,
    selectedTeam,
    members,
    loading,
    error,
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamMembers,
    addTeamMember,
    removeTeamMember,
    updateMemberRole,
    getTeamLead
  };
};

export default useTeam;
