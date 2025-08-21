import SelectItem from "./SelectItem.tsx";
import { useState, useRef, useEffect } from "react";

interface SelectProps {
  placeholder?: string;
  customClasses?: string;
}

function Select({ placeholder, customClasses }: SelectProps) {
  const [selectedItem, setSelectedItem] = useState(placeholder);
  const [isVisible, setVisibility] = useState(false);
  const items = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const selectRef = useRef<HTMLDivElement>(null);

  function handleShowSelectItems() {
    setVisibility((prev) => !prev);
  }

  const handleSelect = (item: string) => {
    setSelectedItem(item);
    setVisibility(false);
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative noto w-full">
      <button
        onClick={handleShowSelectItems}
        className={`w-full text-start transition-all bg-white p-3 h-12 pl-5 focus:outline-1 focus:outline-gray-400 hover:cursor-pointer ${customClasses}`}
      >
        {selectedItem}
      </button>
      <div
        className={`absolute top-12 w-full z-10 outline outline-1 outline-gray-400 
              transition-all duration-300
              ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {items.map((item, index) => (
          <SelectItem key={index} handleSelect={() => handleSelect(item)}>
            {item}
          </SelectItem>
        ))}
      </div>
    </div>
  );
}

export default Select;
