import { Auth, Quote } from '../components';

export const Signin = () => {
  return (
    <div className='flex h-screen w-screen justify-center items-center '>
      <div className='flex h-2/3 w-11/12 md:w-[85%] bg-white shadow-lg border border-gray-100 rounded-xl'>
        <div className='w-full md:w-1/2'>
          <Auth type={'Login'} />
        </div>
        <div className='hidden md:flex w-1/2'>
          <Quote
            text={`"Log in to continue where you left off and make the most of your experience."`}
          />
        </div>
      </div>
    </div>
  );
};
