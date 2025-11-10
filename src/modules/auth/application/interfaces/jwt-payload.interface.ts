export interface IJwtPayload {
  sub: string;
  email: string;
  phone: string;
  name: string;
  iat?: number;
  exp?: number;
}
