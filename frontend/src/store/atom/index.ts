import { atom } from 'recoil';
import { LoginDataProps } from '../../api/auth';
import { Socket } from 'socket.io-client';

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

export const socketAtom = atom<Socket | null>({
  key: 'socketAtom',
  default: null,
});
