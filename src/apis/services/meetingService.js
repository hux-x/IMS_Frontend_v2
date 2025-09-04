import {
  getMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getFilteredMeetings,
  getMeetingById,
  getMeetingsByStatus,
  getMeetingsByDate,
} from "@/apis/endpoints/meetings";
import { getAllEmployees } from "../endpoints/auth";

const meetingService = {
  getAllMeetings: async (limit = 50, offset = 0) => {
    return await getMeetings({ limit, offset });
  },

  createMeeting: async (meeting) => {
    const {
      title,
      description,
      startTime,
      endTime,
      employees,
      clients = [],
      status = "planned",
    } = meeting;

    return await createMeeting({
      title,
      description,
      startTime,
      endTime,
      employees,
      clients,
      status,
    });
  },

  updateMeeting: async (meetingId, updates) => {
    const {
      title = null,
      description = null,
      startTime = null,
      endTime = null,
      employees = null,
      clients = null,
      status = null,
    } = updates;

    const updateData = Object.fromEntries(
      Object.entries({
        title,
        description,
        startTime,
        endTime,
        employees,
        clients,
        status,
      }).filter(([_, v]) => v !== null && v !== undefined)
    );

    return await updateMeeting(meetingId, updateData);
  },

  deleteMeeting: async (meetingId) => {
    return await deleteMeeting(meetingId);
  },

  getMeetingById: async (meetingId) => {
    return await getMeetingById(meetingId);
  },

  getFilteredMeetings: async (filters = {}) => {
    const queryParams = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, v]) => v !== null && v !== undefined && v !== "" && v !== "All"
      )
    );

    console.log("Meeting filters:", queryParams);
    return await getFilteredMeetings(queryParams);
  },

  getMeetingsByStatus: async (status, limit = 50, offset = 0) => {
    return await getMeetingsByStatus(status, { limit, offset });
  },

  getMeetingsByDate: async (date, limit = 50, offset = 0) => {
    return await getMeetingsByDate(date, { limit, offset });
  },

  getTodaysMeetings: async (limit = 50, offset = 0) => {
    const today = new Date().toISOString().split("T")[0];
    return await getMeetingsByDate(today, { limit, offset });
  },

  getUpcomingMeetings: async (limit = 50, offset = 0) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startDate = tomorrow.toISOString().split("T")[0];

    return await getFilteredMeetings({
      startDate,
      status: "planned",
      limit,
      offset,
      sortBy: "startTime",
      sortOrder: "asc",
    });
  },

  getMyMeetings: async (employeeId, limit = 50, offset = 0) => {
    return await getFilteredMeetings({
      employeeId,
      limit,
      offset,
      sortBy: "startTime",
      sortOrder: "asc",
    });
  },

  getMyCreatedMeetings: async (employeeId, limit = 50, offset = 0) => {
    return await getFilteredMeetings({
      createdBy: employeeId,
      limit,
      offset,
      sortBy: "startTime",
      sortOrder: "desc",
    });
  },

  getMeetingsInDateRange: async (startDate, endDate, filters = {}) => {
    return await getFilteredMeetings({
      startDate,
      endDate,
      ...filters,
      sortBy: "startTime",
      sortOrder: "asc",
    });
  },

  searchMeetings: async (searchTerm, filters = {}) => {
    return await getFilteredMeetings({
      title: searchTerm,
      ...filters,
      sortBy: "startTime",
      sortOrder: "asc",
    });
  },

  getEmployeesForMeeting: async () => {
    return await getAllEmployees();
  },

  getMeetingStatistics: async () => {
    try {
      const [planned, completed, cancelled] = await Promise.all([
        getMeetingsByStatus("planned"),
        getMeetingsByStatus("completed"),
        getMeetingsByStatus("cancelled"),
      ]);

      return {
        total:
          planned.data.length + completed.data.length + cancelled.data.length,
        planned: planned.data.length,
        completed: completed.data.length,
        cancelled: cancelled.data.length,
      };
    } catch (error) {
      console.error("Error fetching meeting statistics:", error);
      throw error;
    }
  },

  validateMeetingTime: (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { isValid: false, error: "Invalid date format" };
    }

    if (end <= start) {
      return { isValid: false, error: "End time must be after start time" };
    }

    if (start < new Date()) {
      return {
        isValid: false,
        error: "Meeting cannot be scheduled in the past",
      };
    }

    return { isValid: true };
  },

  formatMeetingForCalendar: (meeting) => {
    return {
      id: meeting._id,
      title: meeting.title,
      start: meeting.startTime,
      end: meeting.endTime,
      description: meeting.description,
      status: meeting.status,
      attendees: meeting.employees?.length || 0,
      clients: meeting.clients?.length || 0,
      creator: meeting.createdBy?.name,
    };
  },
};

export default meetingService;
