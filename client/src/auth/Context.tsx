import { AxiosResponse } from 'axios';
import { createContext } from 'react';

export type User = {
  username: string;
  user_id: number;
  access_token: string;
  refresh_token: string;
  role: string;
};

export type SignInCredentials = {
  username: string;
  password: string;
};

export interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loadingUserData: boolean;
  logIn: (credentials: SignInCredentials) => Promise<AxiosResponse<any, any>>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>({
  user: null,
  isAuthenticated: false,
  loadingUserData: false,
  logIn: async () => { throw new Error('logIn function must be overridden'); },
  signOut: () => { throw new Error('signOut function must be overridden'); },
});
export default AuthContext
