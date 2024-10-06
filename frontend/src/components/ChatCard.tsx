import { UserDataProps } from '../pages/HomePage';

interface ChatCardProps {
  user: UserDataProps;
}

export const ChatCard: React.FC<ChatCardProps> = ({ user }) => {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map((name) => name.charAt(0).toUpperCase());
    return initials.join('');
  };

  return (
    <div className='flex items-center p-4 border border-gray-200 m-4'>
      <div className='w-10 h-10 bg-gray-500 rounded-full flex justify-center items-center text-white'>
        <span>{getInitials(user.name)}</span>
      </div>
      <div className='flex-1 pl-4'>
        <h4 className='text-lg'>{user.name}</h4>
      </div>
    </div>
  );
};
