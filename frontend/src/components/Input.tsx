import { ChangeEvent } from 'react';

interface Input {
  type: string;
  name: string;
  placeholder: string;
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  hidden?: boolean;
}
export const Input = ({
  type,
  name,
  placeholder,
  label,
  onChange,
  value,
  hidden,
}: Input) => {
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={name} className='text-gray-950 text-lg font-semibold'>
        {label}
      </label>
      <input
        hidden={hidden}
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className='p-3 border border-gray-300 rounded-lg'
        onChange={onChange}
        value={value}
      />
    </div>
  );
};
