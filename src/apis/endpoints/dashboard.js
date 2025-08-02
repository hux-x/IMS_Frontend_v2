import client from "@/apis/apiClient/client";

export const getUserDashboard = async()=>{
    return await client.get("/dashboard/employee");
}
export const getTeamDashboard = async(teamId)=>{
    return await client.get(`/dashboard/team/${teamId}`);
}
export const getAdminDashboard = async()=>{
    return await client.get("/dashboard/admin");
}
