import client from "@/apis/apiClient/client";

export const getMeetings = async (params = {}) => {
  const { limit = 50, offset = 0, status, date } = params;
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    ...(status && { status }),
    ...(date && { date }),
  });

  return await client.get(`/meetings?${queryParams}`);
};

export const createMeeting = async (meetingData) => {
  const { title, description, startTime, endTime, employees, clients, status } =
    meetingData;
  return await client.post("/meetings", {
    title,
    description,
    startTime,
    endTime,
    employees,
    clients,
    status,
  });
};

export const updateMeeting = async (id, meetingData) => {
  return await client.patch(`/meetings/${id}`, meetingData);
};

export const deleteMeeting = async (id) => {
  return await client.delete(`/meetings/${id}`);
};

export const getFilteredMeetings = async (filters = {}) => {
  const {
    status,
    startDate,
    endDate,
    employeeId,
    createdBy,
    title,
    limit = 50,
    offset = 0,
    sortBy = "startTime",
    sortOrder = "asc",
  } = filters;

  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    sortBy,
    sortOrder,
    ...(status && { status }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(employeeId && { employeeId }),
    ...(createdBy && { createdBy }),
    ...(title && { title }),
  });

  return await client.get(`/meetings/filter?${queryParams}`);
};

export const getMeetingById = async (id) => {
  return await client.get(`/meetings/${id}`);
};

export const getMeetingsByStatus = async (status, params = {}) => {
  const { limit = 50, offset = 0 } = params;
  return await getMeetings({ limit, offset, status });
};

export const getMeetingsByDate = async (date, params = {}) => {
  const { limit = 50, offset = 0 } = params;
  return await getMeetings({ limit, offset, date });
};
