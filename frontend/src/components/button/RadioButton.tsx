interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  text: string;
}

const RadioButton = ({ text, disabled, ...rest }: RadioProps) => {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}>
      <div className="relative flex items-center">
        <input
          type="radio"
          disabled={disabled}
          className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-primary-500 checked:bg-white transition-all disabled:border-gray-200"
          {...rest}
        />
        <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-primary-500 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
      <span className="text-gray-700 select-none text-sm font-medium">{text}</span>
    </label>
  );
};

export default RadioButton;
