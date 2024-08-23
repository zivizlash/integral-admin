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
