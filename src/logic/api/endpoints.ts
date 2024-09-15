import { formatNumeric } from "../tools/formatters";

export const USERS_TOKEN = "users/token";
export const USERS_CURRENT = "users/current";
export const ADMIN_GETUSERS = "admin/users";
export const ADMIN_GETUSER = (userId: number) =>  `admin/users/${userId}`;
export const ADMIN_CREATEUSER = "admin/users";
export const ADMIN_GET_PATHS = (userId: number) => `admin/users/paths/${userId}`;
export const ADMIN_GET_CATEGORIES = (userId: number) => `admin/users/categories/${userId}`;
export const ADMIN_UPDATEUSER = "admin/users";
export const PATH_BROWSE = (path: string) => `documents/browse?path=${path}`;
export const CATEGORIES_GET = "categories";
export const ADMIN_UPDATE_PATH = (userId: number) => `admin/users/paths/${userId}`;
export const ADMIN_UPDATE_CATEGORIES = (userId: number) => `admin/users/categories/${userId}`;
export const CHANGES_QUERY = (from: Date) => `changes?from=${formatNumeric(from)}`;
