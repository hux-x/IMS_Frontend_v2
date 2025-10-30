// systemService.js
import {
    getSystemData,
    addDepartment,
    getDepartments,
    removeDepartment,
    addRole,
    getRoles,
    getRoleByName,
    updateRolePermissions,
    removeRole,
    checkPermission,
    postAnnouncement,
    getAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} from "@/apis/endpoints/system";

const systemService = {
    // System Data
    getSystemData: async () => {
        return await getSystemData();
    },

    // Department Operations
    addDepartment: async (department) => {
        return await addDepartment(department);
    },

    getDepartments: async () => {
        return await getDepartments();
    },

    removeDepartment: async (department) => {
        return await removeDepartment(department);
    },

    // Role Operations
    addRole: async (role, permission) => {
        return await addRole(role, permission);
    },

    getRoles: async () => {
        return await getRoles();
    },

    getRoleByName: async (role) => {
        return await getRoleByName(role);
    },

    updateRolePermissions: async (role, permission) => {
        return await updateRolePermissions(role, permission);
    },

    removeRole: async (role) => {
        return await removeRole(role);
    },

    checkPermission: async (role, permission) => {
        return await checkPermission(role, permission);
    },

    // Announcement Operations
    postAnnouncement: async (postedBy, message, imageURL, link) => {
        return await postAnnouncement(postedBy, message, imageURL, link);
    },

    getAnnouncement: async () => {
        return await getAnnouncement();
    },

    updateAnnouncement: async (message, imageURL, link) => {
        return await updateAnnouncement(message, imageURL, link);
    },

    deleteAnnouncement: async () => {
        return await deleteAnnouncement();
    }
};

export default systemService;