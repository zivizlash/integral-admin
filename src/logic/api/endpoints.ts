export const USERS_TOKEN = "users/token";
export const USERS_CURRENT = "users/current";
export const ADMIN_GETUSERS = "admin/users";
export const ADMIN_GETUSER = (userId: number) =>  `admin/users/${userId}`;
export const ADMIN_GET_PATHS = (userId: number) => `admin/users/paths/${userId}`;
export const ADMIN_GET_CATEGORIES = (userId: number) => `admin/users/categories/${userId}`;
