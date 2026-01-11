import { useState, useEffect, useRef } from "react";
import { getAlgorithm, type AlgorithmItemProps } from "@api/code/codeSubmit";

interface SearchInputProps {
  selectedItems: AlgorithmItemProps[];
  onItemsChange: (items: AlgorithmItemProps[]) => void;
  formId?: string;
  className?: string;
}

const SearchInput = ({
  selectedItems,
  onItemsChange,
  formId,
  className,
}: SearchInputProps) => {
  const [value, setValue] = useState("");
  const [searchResults, setSearchResults] = useState<AlgorithmItemProps[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [clicked, setClicked] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAlgorithms = async () => {
      if (!value.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await getAlgorithm(value);
        if (response && response.algorithmList) {
          // 이미 선택한 알고리즘은 검색 결과에서 제외
          const selectedIds = selectedItems.map((item) => item.id);
          const filteredResults = response.algorithmList.filter(
            (algo) => !selectedIds.includes(algo.id),
          );
          setSearchResults(filteredResults);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Failed to fetch algorithms", error);
        setSearchResults([]);
      }
    };

    const debounce = setTimeout(() => {
      fetchAlgorithms();
    }, 300);

    return () => clearTimeout(debounce);
  }, [value, selectedItems]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    setClicked(!clicked);
  };

  const handleSelectItem = (item: AlgorithmItemProps) => {
    // Prevent duplicates
    if (!selectedItems.find((i) => i.id === item.id)) {
      onItemsChange([...selectedItems, item]);
    }
    setValue("");
    setSearchResults([]);
    setIsFocused(false);
  };

  const handleRemoveItem = (id: number) => {
    onItemsChange(selectedItems.filter((item) => item.id !== id));
  };

  return (
    <div
      className={`flex flex-col items-start gap-2 p-0 ${className || "w-[577px]"}`}
      ref={wrapperRef}
    >
      <div className="relative w-full">
        <form
          id={formId}
          onSubmit={(e) => e.preventDefault()}
          className="relative w-full"
        >
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="알고리즘 선택"
            className={`h-9 w-full rounded-lg border px-3 py-2 pr-10 text-sm transition-all focus:outline-none ${clicked ? "border-primary-500 ring-primary-500 ring-1" : "border-gray-300 focus:border-[#0D6EFD] focus:ring-1 focus:ring-[#0D6EFD]"}`}
          />

          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              className="absolute top-0 right-10 flex h-9 w-10 items-center justify-center hover:opacity-75"
            >
              <img src="/icons/clearIcon.svg" className="size-4" alt="clear" />
            </button>
          )}

          <button
            type="submit"
            onMouseDown={handleClick}
            onMouseUp={handleClick}
            className={`absolute top-0 right-0 flex h-9 w-10 items-center justify-center rounded-r-lg transition-colors ${clicked ? "bg-primary-600" : "bg-primary-500 hover:bg-primary-600"}`}
          >
            <img
              src="/icons/searchIcon.svg"
              className="size-4 brightness-0 invert"
              alt="search"
            />
          </button>
        </form>

        {/* Dropdown Results */}
        {isFocused && searchResults.length > 0 && (
          <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
            {searchResults.map((algo) => (
              <div
                key={algo.id}
                className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleSelectItem(algo)}
              >
                {algo.name}
              </div>
            ))}
          </div>
        )}
        {isFocused && searchResults.length === 0 && (
          <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
            <div className="cursor-pointer px-4 py-2 text-sm text-gray-500 hover:bg-gray-100">
              검색된 알고리즘이 없습니다.
            </div>
          </div>
        )}
      </div>

      {/* Selected Chips */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="bg-primary-50 border-primary-200 text-primary-700 flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium"
            >
              <span>{item.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="hover:text-primary-900 ml-1 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
