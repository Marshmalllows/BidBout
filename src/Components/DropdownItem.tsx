import { type ReactNode } from "react";

interface DropdownItemProps {
  children?: ReactNode;
  onClick?: () => void;
}

function DropdownItem({ children, onClick }: DropdownItemProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white transition-all hover:cursor-pointer hover:bg-gray-200 px-5 py-1"
    >
      {children}
    </div>
  );
}

export default DropdownItem;
