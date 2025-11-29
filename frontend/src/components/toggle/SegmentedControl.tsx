import { useState } from "react";

const SegmentedControl = ({
  onChange,
}: {
  onChange?: (value: string) => void;
}) => {
  const options = ["전체", "인기순", "기업대비", "알고리즘"];
  const [active, setActive] = useState("전체");

  const handleClick = (option: string) => {
    setActive(option);
    if (onChange) onChange(option); // 정렬 변경 함수 호출
  };

  return (
    <div className="inline-flex gap-2 bg-grayscale-default rounded-[10px] shadow-[0px_1px_5px_rgba(0,0,0,0.1)]">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleClick(option)}
          className={`px-4 py-1 rounded-[10px] transition-colors ${
            active === option
              ? "bg-white text-primary-main"
              : "bg-grayscale-default text-grayscale-dark-gray"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
