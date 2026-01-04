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
        if (response) {
          setSearchResults(response.algorithmList);
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
  }, [value]);

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
            className={`h-10 w-full rounded-md border-2 px-3 py-2 pr-10 transition-colors focus:shadow-[0px_1px_5px_rgba(0,0,0,0.1)] focus:outline-none ${clicked ? "border-primary-300" : "border-primary-main"}`}
          />

          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              className="absolute top-0 right-10 flex size-10 items-center justify-center"
            >
              <img src="/icons/clearIcon.svg" className="size-4" alt="clear" />
            </button>
          )}

          <button
            type="submit"
            onMouseDown={handleClick}
            onMouseUp={handleClick}
            className={`absolute top-0 right-0 flex size-10 items-center justify-center rounded-r-md transition-colors ${clicked ? "bg-primary-300" : "bg-primary-main"}`}
          >
            <img src="/icons/searchIcon.svg" className="size-4" alt="search" />
          </button>
        </form>

        {/* Dropdown Results */}
        {isFocused && searchResults.length > 0 && (
          <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
            {searchResults.map((algo) => (
              <div
                key={algo.id}
                className="cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => handleSelectItem(algo)}
              >
                {algo.name}
              </div>
            ))}
          </div>
        )}
        {isFocused && searchResults.length === 0 && (
          <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
            <div className="text-grayscale-warm-gray cursor-pointer px-4 py-2 hover:bg-gray-100">
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
              className="bg-primary-600 text-primary-main flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
            >
              <span>{item.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="hover:text-primary-dark"
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
