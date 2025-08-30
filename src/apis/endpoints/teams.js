export const createTeam = async (name, members, teamLeadId) => {
  const body = { name, members };
  if (teamLeadId) body.teamLeadId = teamLeadId;
  return await client.post("/teams/create", body);
};

export const getAllTeams = async () => {
  return await client.get("/teams/all");
};

export const getTeamById = async (teamId) => {
  return await client.get(`/teams/${teamId}`);
};

export const updateTeam = async (teamId, name, teamLead) => {
  const body = {};
  if (name) body.name = name;
  if (teamLead) body.teamLead = teamLead;
  return await client.put(`/teams/update/${teamId}`, body);
};

export const deleteTeam = async (teamId) => {
  return await client.delete(`/teams/${teamId}`);
};

export const addTeamMember = async (teamId, employeeId) => {
  return await client.post(`/teams/${teamId}/members/${employeeId}`);
};

export const removeTeamMember = async (teamId, employeeId) => {
  return await client.delete(`/teams/${teamId}/members/${employeeId}`);
};

export const getTeamMembers = async (teamId) => {
  return await client.get(`/teams/${teamId}/members`);
};

export const updateMemberRole = async (teamId, memberId, role) => {
  return await client.patch(`/teams/${teamId}/members/${memberId}/role`, { role });
};

export const getTeamLead = async (teamId) => {
  return await client.get(`/teams/${teamId}/lead`);
};
