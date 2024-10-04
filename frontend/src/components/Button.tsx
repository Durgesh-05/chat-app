interface Button {
  type: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  text: string;
  className?: string;
  disabled?: boolean;
}
export const Button = ({
  type,
  onClick,
  text,
  className,
  disabled,
}: Button) => {
  return (
    <div>
      <button
        className={`bg-gray-950 text-center rounded-lg py-2 px-6 w-full text-white font-semibold text-lg hover:bg-gray-900 ${className}`}
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
};
