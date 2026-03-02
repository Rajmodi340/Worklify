export const BASE_URL = "http://localhost:9876";

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        PROFILE: "/api/auth/profile",
        UPDATE_PROFILE: "/api/auth/update",
        UPLOAD_IMAGE: "/api/auth/upload-image",
    },
    USER: {
        GET_ALL: "/api/user/getuser",
        GET_BY_ID: (id) => `/api/user/${id}`,
    },
    TASK: {
        CREATE: "/api/task/create",
        GET_ALL: "/api/task",
        GET_BY_ID: (id) => `/api/task/${id}`,
        UPDATE: (id) => `/api/task/${id}`,
        DELETE: (id) => `/api/task/${id}`,
        UPDATE_STATUS: (id) => `/api/task/${id}/status`,
        UPDATE_TODO: (id) => `/api/task/${id}/todo`,
        DASHBOARD_DATA: "/api/task/dashboard-data",
        USER_DASHBOARD_DATA: "/api/task/user-dashboard-data",
    },
    REPORTS: {
        EXPORT_TASKS: "/api/reports/exports/tasks",
        EXPORT_USERS: "/api/reports/exports/users",
    }
};
