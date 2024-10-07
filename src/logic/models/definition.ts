export type User = {
  id: number;
  login: string;
  firstName: string | null;
  lastName: string | null;
  role: number;
  createdAt: Date;
  updatedAt: Date;
};

export type JwtTokens = {
  access: string,
  refresh: string
};

export type EntityDataType = 
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type EntityOperationType = 0 | 1 | 2;

export type EntityChangeItem = {
  property: string,
  oldValue: string,
  newValue: string,
  type: EntityDataType,
  operation: EntityOperationType
};

export type EntityChange = {
  id: number
  createdAt: Date,
  createdById: number,
  entityId: number,
  changes: EntityChangeItem[]
};

export type EntityChangeTypeDto = {
  change: EntityChange,
  entityType: string,
  day: Date
};

export type EntityChangeType = {
  change: EntityChange,
  entityType: string
};

export type AccessMode = 0 | 1 | 2;

export type UserRole = 0 | 1 | 2;

export const USER_ROLE_READER = 0;
export const USER_ROLE_EDITOR = 1;
export const USER_ROLE_ADMIN = 2;

export type UpdateStatus = "none" | "progress" | "success" | "fail";

export type UserPathItem = {
  categoryId: number,
  accessMode: AccessMode
};

export type UserPaths = {
  allowedPaths: string[]
};

export type DocumentEntry = {
  path: string,
  name: string,
  isDirectory: boolean
};

export type UserCategories = {
  restrictedRead: number[],
  restrictedWrite: number[]
};

export type CategoryInfo = {
  id: number,
  name: string | null
};
