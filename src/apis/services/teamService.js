import {createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam, addTeamMember, removeTeamMember, getTeamMembers, updateMemberRole, getTeamLead} from "@/apis/endpoints/teams";

  const teamService = {
  createTeam: async ({ name, members, teamLeadId }) => {
    return await createTeam(name, members, teamLeadId);
  },
  getAllTeams: async () => {
    return await getAllTeams();
  },
  getTeamById: async ({ teamId }) => {
    return await getTeamById(teamId);
  },
  updateTeam: async ({ teamId, name, teamLead }) => {
    return await updateTeam(teamId, name, teamLead);
  },
  deleteTeam: async ({ teamId }) => {
    return await deleteTeam(teamId);
  },
  addTeamMember: async ({ teamId, employeeId }) => {
    return await addTeamMember(teamId, employeeId);
  },
  removeTeamMember: async ({ teamId, employeeId }) => {
    return await removeTeamMember(teamId, employeeId);
  },
  getTeamMembers: async ({ teamId }) => {
    return await getTeamMembers(teamId);
  },
  updateMemberRole: async ({ teamId, memberId, role }) => {
    return await updateMemberRole(teamId, memberId, role);
  },
  getTeamLead: async ({ teamId }) => {
    return await getTeamLead(teamId);
  },
};
export default teamService
