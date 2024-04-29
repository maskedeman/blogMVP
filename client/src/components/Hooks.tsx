import { useContext } from 'react';
import AuthContext from '../auth/Context';

export function useSession() {
  const contextValue = useContext(AuthContext);
  return contextValue;
}