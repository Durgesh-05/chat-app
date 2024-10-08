import './App.css';
import { Route, Routes } from 'react-router-dom';
import { HomePage, Signin, Signup } from './pages';
import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authAtom, socketAtom } from './store/atom';
import { ChatPage } from './pages/ChatPage';
import { io } from 'socket.io-client';
import { BACKEND_URL } from './utils/utils';
const App = () => {
  const [authState, setAuthState] = useRecoilState(authAtom);
  const setSocket = useSetRecoilState(socketAtom);

  useEffect(() => {
    const socket = io(BACKEND_URL);
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [setSocket]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (!user.accessToken) {
        setAuthState({
          user: null,
          isAuthenticated: false,
        });
      }
      setAuthState({
        user,
        isAuthenticated: true,
      });
    }
  }, []);
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/chat/:id' element={<ChatPage authState={authState} />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/signin' element={<Signin />} />
    </Routes>
  );
};

export default App;
