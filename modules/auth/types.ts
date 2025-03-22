export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiration?: string;
  username?: string;
  tokenType: string;
  requiresTwoFactor: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  email: string;
}

export interface AuthContextType {
  user: Partial<AuthResponse> | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: RegisterCredentials) => Promise<boolean>;
} 