import { type ReactNode } from "react";

interface SelectItemProps {
  children?: ReactNode;
  handleSelect?: () => void;
}

function SelectItem({ children, handleSelect }: SelectItemProps) {
  return (
    <div
      onClick={handleSelect}
      className="bg-white transition-all hover:cursor-pointer hover:bg-gray-200 px-5 py-1"
    >
      {children}
    </div>
  );
}

export default SelectItem;
