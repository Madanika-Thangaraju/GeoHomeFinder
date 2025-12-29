export interface LoginPayload {
  identifier: string; // Can be email or phone
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    name: string;
    phone: string;
    email: string;
  };
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  role?: string;
}