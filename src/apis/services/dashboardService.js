import { getUserDashboard, getTeamDashboard, getAdminDashboard } from "@/apis/endpoints/dashboard";

const dashboardService = {
    getUserDashboard: async () => {
        return await getUserDashboard();
    },
    getTeamDashboard: async (teamId) => {
        return await getTeamDashboard(teamId);
    },
    getAdminDashboard: async () => {
        return await getAdminDashboard();
    },
};
export default dashboardService;