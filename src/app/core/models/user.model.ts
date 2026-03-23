export interface User {
  id: string;
  email: string;
  password?: string;
  role: 'admin' | 'waiter' | 'chef' | 'cashier';
  name: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
