import { AuthState } from '../store/atom';

export const HomePage = ({ authState }: { authState: AuthState }) => {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      <div className=' font-bold text-3xl'>{authState.user?.name}</div>
      <div className=' font-bold text-3xl'>{authState.user?.email}</div>
      <div className='text-sm font-bold'>{authState.user?.createdAt}</div>
    </div>
  );
};
