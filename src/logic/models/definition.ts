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
