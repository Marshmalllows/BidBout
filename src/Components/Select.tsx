import SelectItem from "./SelectItem.tsx";
import { useState, useRef, useEffect } from "react";

type Category = {
  id: number;
  name: string;
};

interface SelectProps {
  placeholder?: string;
  customClasses?: string;
  items: Category[];
  value?: Category;
  onChange?: (value: Category) => void;
}

function Select({
  placeholder,
  customClasses,
  items,
  value,
  onChange,
}: SelectProps) {
  const [selectedItem, setSelectedItem] = useState<Category | undefined>(value);
  const [isVisible, setVisibility] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  function handleShowSelectItems() {
    setVisibility((prev) => !prev);
  }

  const handleSelect = (item: Category) => {
    setSelectedItem(item);
    setVisibility(false);
    onChange?.(item);
  };

  useEffect(() => {
    setSelectedItem(value);
  }, [value]);

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
    <div ref={selectRef} className="relative noto w-full">
      <button
        onClick={handleShowSelectItems}
        className={`w-full text-start transition-all bg-white p-3 h-12 pl-5 focus:outline-1 focus:outline-gray-400 hover:cursor-pointer ${customClasses}`}
      >
        {selectedItem ? selectedItem.name : placeholder}
      </button>
      <div
        className={`absolute top-12 w-full z-10 outline outline-1 outline-gray-400 transition-all duration-300 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {items.map((item) => (
          <SelectItem key={item.id} handleSelect={() => handleSelect(item)}>
            {item.name}
          </SelectItem>
        ))}
      </div>
    </div>
  );
}

export default Select;
