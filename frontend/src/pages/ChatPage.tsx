import { io } from 'socket.io-client';
import { BACKEND_URL } from '../utils/utils';
import { useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { authAtom } from '../store/atom';

export const ChatPage = () => {
  const authState = useRecoilValue(authAtom);
  console.log(authState.user?.token);

  const socket = useMemo(
    () =>
      io(BACKEND_URL, {
        auth: {
          token: authState.user?.token,
        },
      }),
    []
  );

  useEffect(() => {
    socket.on('connect', () => {
      console.log('User Connected to the chat ', socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return <div>ChatPage</div>;
};
