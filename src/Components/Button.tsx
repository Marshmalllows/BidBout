import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "secondary" | "rounded";
};

function Button({ variant, ...props }: ButtonProps) {
  const base =
    "border-1 w-full arimo transition-all border-gray-400 py-3 px-2 my-4 bg-gray-200 sm:text-lg hover:bg-gray-300 hover:border-gray-500 " +
    "hover:cursor-pointer";
  const variants: Record<string, string> = {
    secondary:
      "border-1 w-full arimo transition-all border-gray-400 py-3 px-2 my-4 bg-white text-sm sm:text-base hover:bg-gray-100 " +
      "hover:border-gray-500 hover:cursor-pointer",
    rounded: "",
  };

  const className = variant && variants[variant] ? variants[variant] : base;

  return (
    <button className={className} {...props}>
      {props.children}
    </button>
  );
}

export default Button;
