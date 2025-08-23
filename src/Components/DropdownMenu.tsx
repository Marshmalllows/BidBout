import { useState, useRef, useEffect } from "react";
import Button from "./Button.tsx";
import DropdownItem from "./DropdownItem.tsx";

interface DropdownProps {
  placeholder?: string;
  options: { label: string; onClick: () => void }[];
}

function DropdownMenu({ placeholder, options }: DropdownProps) {
  const [isVisible, setVisibility] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  function handleShowSelectItems() {
    setVisibility((prev) => !prev);
  }

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
    <div ref={selectRef} className="flex relative noto justify-center">
      <Button onClick={handleShowSelectItems} variant="borderless">
        {placeholder}
      </Button>
      <div
        className={`absolute top-15 w-30 z-10 outline outline-1 outline-gray-400 
              transition-all duration-300 origin-top
              ${isVisible ? "opacity-100 scale-100" : "scale-90 opacity-0 pointer-events-none"}`}
      >
        {options.map((opt, i) => {
          return (
            <DropdownItem onClick={opt.onClick} key={i}>
              {opt.label}
            </DropdownItem>
          );
        })}
      </div>
    </div>
  );
}

export default DropdownMenu;
