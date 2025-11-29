import { useState } from "react";

interface InputProps {
  formId: string;
  value: string;
  onClear: () => void;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SearchInput = ({ formId, onSubmit }: InputProps) => {
  const [value, setValue] = useState("");
  const [clicked, setClicked] = useState(false); // 버튼 클릭 상태

  const handleClick = () => {
    setClicked(!clicked); // 클릭할 때마다 색 변경
  };

  return (
    <form
      id={formId}
      onSubmit={(e) => onSubmit(e)}
      className="relative w-[660px]"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="검색어를 입력하세요"
        className={`w-full h-9 px-3 py-2 pr-10 border-2 rounded-md focus:outline-none focus:shadow-[0px_1px_5px_rgba(0,0,0,0.1)] 
          ${clicked ? "border-primary-300" : "border-primary-main"}`}
      />

      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute flex justify-center items-center size-9 top-0 right-9"
        >
          <img src="/icons/clearIcon.svg" className="size-4" />
        </button>
      )}

      <button
        type="submit" // submit이 아닌 button
        onMouseDown={handleClick} // 클릭 시 상태 변경
        onMouseUp={handleClick}
        className={`absolute top-0 right-0 size-9 flex items-center justify-center rounded-r-md 
          ${clicked ? "bg-primary-300" : "bg-primary-main"}`}
      >
        <img src="/icons/searchIcon.svg" className="size-4" />
      </button>
    </form>
  );
};

export default SearchInput;
