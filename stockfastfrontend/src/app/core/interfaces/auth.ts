export interface Login {
  name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface Register {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
}

export interface JwtPayloadInterface {
  username?: string;
  plan?: string;
  exp?: number;
  iat?: number;
}
