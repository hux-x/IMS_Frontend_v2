// endpoints.js
import client from "@/apis/apiClient/client";

export const getSystemData = async () => {
    return await client.get("/system/data");
};

export const addDepartment = async (department) => {
    return await client.post("/system/departments", { department });
};

export const getDepartments = async () => {
    return await client.get("/system/departments");
};

export const removeDepartment = async (department) => {
    return await client.delete("/system/departments", { data: { department } });
};

export const addRole = async (role, permission) => {
    return await client.post("/system/roles", { role, permission });
};

export const getRoles = async () => {
    return await client.get("/system/roles");
};

export const getRoleByName = async (role) => {
    return await client.get(`/system/roles/${role}`);
};

export const updateRolePermissions = async (role, permission) => {
    return await client.put(`/system/roles/${role}/permissions`, { permission });
};

export const removeRole = async (role) => {
    return await client.delete("/system/roles", { data: { role } });
};

export const checkPermission = async (role, permission) => {
    return await client.post("/system/check-permission", { role, permission });
};

export const postAnnouncement = async (postedBy, message, imageURL, link) => {
    return await client.post("/system/announcements", { postedBy, message, imageURL, link });
};

export const getAnnouncement = async () => {
    return await client.get("/system/announcements");
};

export const updateAnnouncement = async (message, imageURL, link) => {
    return await client.put("/system/announcements", { message, imageURL, link });
};

export const deleteAnnouncement = async () => {
    return await client.delete("/system/announcements");
};