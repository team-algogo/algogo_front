interface InputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const IdInput = ({ id, value, onChange }: InputProps) => {
  return (
    <div className="flex items-center w-full h-12 bg-grayscale-default border border-grayscale-warm-gray rounded-md overflow-hidden">
      <div className="flex-1 flex items-center relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="아이디를 입력하세요"
          autoComplete="username"
          className="w-full h-full px-4 text-grayscale-dark-gray placeholder-grayscale-warm-gray outline-none bg-transparent"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 flex justify-center items-center size-6 rounded-full transition-colors"
          >
            <img src="/icons/clearIcon.svg" className="size-4" alt="clear" />
          </button>
        )}
      </div>

      <div className="relative h-full">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <img src="/icons/toggleIcons.svg" className="size-4" alt="toggle" />
        </div>
      </div>
    </div>
  );
};

export default IdInput;
