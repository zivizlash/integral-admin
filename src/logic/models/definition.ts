export type User = {
  id: number;
  login: string;
  role: number;
};

export type JwtTokens = {
  access: string,
  refresh: string
};
