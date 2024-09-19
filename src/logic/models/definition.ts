export type User = {
  id: number;
  login: string;
  role: number;
  createdAt: Date;
  updatedAt: Date;
};

export type JwtTokens = {
  access: string,
  refresh: string
};

export type EntityChangeItem = {
  property: string,
  oldValue: string,
  newValue: string,
  type: 0 | 1 | 2
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
