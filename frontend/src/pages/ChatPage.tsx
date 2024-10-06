import { useEffect, useMemo, useState } from 'react';
import { AuthState } from '../store/atom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../utils/utils';
import { useParams } from 'react-router-dom';

export const ChatPage = ({ authState }: { authState: AuthState }) => {
  const { id } = useParams();
  const socket = useMemo(() => io(`${BACKEND_URL}`), []);
  const [username, setUsername] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [messages, setMessages] = useState<
    { text: string; senderId: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [hasJoinedRoom, setHasJoinedRoom] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserChats = async () => {
      try {
        if (authState.user !== null) {
          const res = await axios.get(
            `${BACKEND_URL}/api/v1/chat/${authState.user.id}/${id}`
          );
          if (res.status === 200 || res.status === 201) {
            const participants = res.data.data.participants;
            const matchedUser = participants.find(
              (user: any) => user.id === id
            );
            if (matchedUser) {
              setUsername(matchedUser.name || '');
              setRoomId(res.data.data.id);
              setMessages([]);
            } else {
              console.error('No user found with matching ID');
            }
          }
        }
      } catch (e) {
        console.error('Failed to Fetch Chat ', e);
      }
    };
    fetchUserChats();
  }, [authState.user, id]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WS Server');
    });

    socket.on(
      'message',
      ({ message, senderId }: { message: string; senderId: string }) => {
        console.log('Message: ', message, ' by: ', senderId);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, senderId },
        ]);
      }
    );

    return () => {
      socket.off('connect');
      socket.disconnect();
    };
  }, [authState.user]);

  const handleJoinRoom = () => {
    socket.emit('join room', { roomId });
    setHasJoinedRoom(true);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && hasJoinedRoom) {
      socket.emit('send message', {
        roomId,
        message: newMessage,
        senderId: authState.user?.id,
        recipientId: id,
      });
      setMessages((prevMessages: any) => [
        ...prevMessages,
        { text: newMessage, senderId: authState.user?.id },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className='flex flex-col h-screen'>
      <div className='bg-gray-800 text-white p-4 flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className='bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl'>
            {username.charAt(0).toUpperCase()}
          </div>
          <span className='text-lg font-semibold'>{username}</span>
        </div>
      </div>

      <div className='flex-1 p-4 overflow-auto'>
        {messages.length > 0 ? (
          <div className='space-y-3'>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg w-max max-w-xs ${
                  msg.senderId === authState.user?.id
                    ? 'bg-blue-500 text-white self-end'
                    : 'bg-gray-100 self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        ) : (
          <div className='text-gray-500 text-center'>
            Start chatting with {username}!
          </div>
        )}
      </div>

      <div className='p-4 bg-white flex items-center space-x-3'>
        {!hasJoinedRoom ? (
          <button
            onClick={handleJoinRoom}
            className='bg-blue-500 text-white px-4 py-2 rounded-lg'
          >
            Join Chat
          </button>
        ) : (
          <>
            <input
              type='text'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder='Type a message...'
              className='flex-1 p-2 border border-gray-300 rounded-lg'
            />
            <button
              onClick={handleSendMessage}
              className='bg-blue-500 text-white px-4 py-2 rounded-lg'
            >
              Send
            </button>
          </>
        )}
      </div>
    </div>
  );
};
