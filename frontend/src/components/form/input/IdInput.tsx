interface InputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const IdInput = ({ id, value, onChange }: InputProps) => {
  return (
    <div className="flex items-center w-full h-10 bg-white border border-gray-300 rounded-md overflow-hidden transition-colors focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500">
      <div className="flex-1 flex items-center relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="아이디를 입력하세요"
          autoComplete="username"
          className="w-full h-full px-4 text-gray-900 placeholder-gray-400 outline-none bg-transparent text-sm"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 flex justify-center items-center size-6 rounded-full hover:bg-gray-100 transition-colors"
          >
            <img src="/icons/clearIcon.svg" className="size-4 opacity-60 hover:opacity-100 transition-opacity" alt="clear" />
          </button>
        )}
      </div>

      <div className="relative h-full flex items-center pr-3">
        <div className="pointer-events-none opacity-40">
          <img src="/icons/toggleIcons.svg" className="size-4" alt="toggle" />
        </div>
      </div>
    </div>
  );
};

export default IdInput;
