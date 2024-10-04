import { io, Socket } from 'socket.io-client';
import { BACKEND_URL } from '../utils/utils';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { AuthState } from '../store/atom';

// interface UserData {
//   username: string;
//   name: string;
//   id: string;
// }

export const ChatPage = ({ authState }: { authState: AuthState }) => {
  // const [userData, setUserData] = useState<UserData>({
  //   username: '',
  //   name: '',
  //   id: '',
  // });
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [room, setRoom] = useState<string>('');

  const socket = useMemo(
    () =>
      io(BACKEND_URL, {
        auth: {
          token: authState.user?.token,
        },
      }),
    [authState.user?.token]
  );

  useEffect(() => {
    socket.on('connect', () => {
      console.log('User Connected to the chat ', socket.id);
    });

    // socket.on('me', ({ username, name, id }: UserData) => {
    //   setUserData({
    //     username: username,
    //     name: name,
    //     id: id,
    //   });
    // });

    socket.emit('join_room', {
      userId1: authState.user?.id,
      userId2: 'y78yubh',
    });
    socket.on('roomId', ({ roomId }: { roomId: string }) => {
      console.log('Room Id', roomId);
      setRoom(roomId);
    });

    socket.on('message', ({ message }: { message: string }) => {
      console.log(message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, authState]);

  const submitHandler = () => {
    console.log('clicked');

    socket.emit('send_message', {
      message: input,
      userId: 'bhsdbyt7',
      roomId: room,
    });
    console.log('clicked');

    setInput('');
  };

  return (
    <div className='flex flex-col h-screen justify-center items-center font-semibold text-lg'>
      <div className='w-1/2 h-1/2 border border-gray-950 rounded-xl'>
        {...messages}
      </div>
      <div className='flex flex-col gap-2'>
        <input
          type='text'
          name='input'
          value={input}
          id='input'
          className='p-4 border border-gray-400 mt-4'
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
        <button
          type='submit'
          onClick={submitHandler}
          className='px-6 py-4 bg-black text-white rounded-xl'
        >
          Send
        </button>
      </div>
    </div>
  );
};
