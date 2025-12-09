import { useState } from "react";

interface InputProps {
  formId: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const IdInput = ({
  formId,
  value: externalValue,
  onChange,
  onSubmit,
}: InputProps) => {
  const [internalValue, setInternalValue] = useState("");

  const value = externalValue !== undefined ? externalValue : internalValue;

  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(e);
      }}
      className="flex items-center w-full h-12 bg-grayscale-default border border-grayscale-warm-gray rounded-md overflow-hidden"
    >
      <div className="flex-1 flex items-center relative">
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="아이디를 입력하세요"
          className="w-full h-full px-4 text-grayscale-dark-gray placeholder-grayscale-warm-gray outline-none bg-transparent"
        />

        {value && (
          <button
            type="button"
            onClick={() => handleChange("")}
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
    </form>
  );
};

export default IdInput;
