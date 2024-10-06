import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../utils/utils';
import { ChatCard } from '../components/ChatCard';
import { Link } from 'react-router-dom';

export interface UserDataProps {
  name: string;
  email: string;
  id: string;
  chats: any[];
  messages: any[];
}

export const HomePage = () => {
  const [users, setUsers] = useState<UserDataProps[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const res = await axios.get(`${BACKEND_URL}/api/v1/user/${user?.id}`);

          if (res.status === 200) {
            setUsers([...res.data.data]);
          }
        }
      } catch (e) {
        console.error('Failed to fetch users ', e);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className='flex flex-col mt-4 gap-2 w-fit'>
      {users.map((user) => (
        <Link key={user.id} to={`/chat/${user.id}`}>
          <ChatCard user={user} />
        </Link>
      ))}
    </div>
  );
};
