import { atom } from 'recoil';
import { LoginDataProps } from '../../api/auth';

export interface AuthState {
  user: LoginDataProps | null;
  isAuthenticated: boolean;
}

export const authAtom = atom<AuthState>({
  key: 'authAtom',
  default: {
    user: null,
    isAuthenticated: false,
  },
});
