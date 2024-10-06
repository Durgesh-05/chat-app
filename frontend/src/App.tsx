import './App.css';
import { Route, Routes } from 'react-router-dom';
import { HomePage, Signin, Signup } from './pages';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authAtom } from './store/atom';
import { ChatPage } from './pages/ChatPage';
const App = () => {
  const [authState, setAuthState] = useRecoilState(authAtom);
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
