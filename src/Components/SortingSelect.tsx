import SelectItem from "./SelectItem.tsx";
import { useState, useRef, useEffect } from "react";

type SortOption = {
  id: number;
  name: string;
};

interface SortingSelectProps {
  items: SortOption[];
  value?: SortOption;
  onChange?: (value: SortOption) => void;
}

function SortingSelect({ items, value, onChange }: SortingSelectProps) {
  const [isVisible, setVisibility] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  function handleShowSelectItems() {
    setVisibility((prev) => !prev);
  }

  const handleSelect = (item: SortOption) => {
    setVisibility(false);
    onChange?.(item);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setVisibility(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative noto">
      <button
        onClick={handleShowSelectItems}
        className="flex flex-row gap-2 cursor-pointer hover:bg-gray-100 p-2 px-3 rounded-sm items-center transition-colors"
      >
        <img
          alt="sort"
          src="/Icons/arrows-up-down.svg"
          className="w-5 h-5 opacity-60"
        />
        <p className="noto text-sm font-medium text-gray-700">
          {value ? value.name : "Sort items"}
        </p>
      </button>
      <div
        className={`absolute right-0 top-full mt-1 w-48 bg-white z-20 shadow-lg border border-gray-200 rounded-sm transition-all duration-200 origin-top-right ${
          isVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex flex-col py-1">
          {items.map((item) => (
            <SelectItem key={item.id} handleSelect={() => handleSelect(item)}>
              {item.name}
            </SelectItem>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SortingSelect;
