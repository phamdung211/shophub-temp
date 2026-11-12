import type { BaseEntity } from "./base.model";

export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  image: string;
  phone?: string;
  gender?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse extends User {
  accessToken: string;
  refreshToken: string;
}
