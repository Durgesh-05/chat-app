export const Quote = ({ text }: { text: string }) => {
  return (
    <div className='bg-gray-100 flex flex-col justify-center h-full w-full p-8'>
      <h3 className='text-3xl font-bold text-gray-950 mb-4'>{text}</h3>
      <p className='mt-4 text-lg font-medium text-gray-950'>
        - Durgesh Dubey, Creator
      </p>
    </div>
  );
};
