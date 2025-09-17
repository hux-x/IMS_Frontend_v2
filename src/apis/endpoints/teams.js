import client from "@/apis/apiClient/client";

export const createTeam = async (name, members, teamLeadId) => {
  const body = { name, members };
  if (teamLeadId) body.teamLeadId = teamLeadId;
  return await client.post("/teams/createteam", body);
};

export const getAllTeams = async () => {
  return await client.get("/teams/allteams");
};

export const getTeamById = async (teamId) => {
  return await client.get(`/teams/teams/${teamId}`);
};

export const updateTeam = async (teamId, name, teamLead, description, members) => {
  const body = {};
  if (name !== undefined) body.name = name;
  if (teamLead !== undefined) body.teamLead = teamLead;
  if (description !== undefined) body.description = description;
  if (members !== undefined) body.members = members;
  
  return await client.patch(`/teams/updateteam/${teamId}`, body);
};

export const deleteTeam = async (teamId) => {
  return await client.delete(`/teams/deleteteam/${teamId}`);
};

export const addTeamMember = async (teamId, employeeId) => {
  return await client.post(`/teams/teams/${teamId}/members/${employeeId}`);
};

export const removeTeamMember = async (teamId, employeeId) => {
  return await client.delete(`/teams/teams/${teamId}/members/${employeeId}`);
};

export const getTeamMembers = async (teamId) => {
  return await client.get(`/teams/teams/${teamId}/members`);
};

export const updateMemberRole = async (teamId, memberId, role) => {
  return await client.patch(`/teams/teams/${teamId}/members/${memberId}/role`, { role });
};

export const getTeamLead = async (teamId) => {
  return await client.get(`/teams/teams/${teamId}/lead`);
};