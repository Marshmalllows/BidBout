import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  customClasses?: string;
  variant?: "secondary" | "rounded" | "borderless";
};

function Button({ variant, customClasses, ...props }: ButtonProps) {
  const base =
    "border-1 w-full arimo transition-all border-gray-400 py-3 px-2 bg-gray-200 text-sm sm:text-base hover:bg-gray-300 hover:border-gray-500 " +
    "hover:cursor-pointer";

  const variants: Record<string, string> = {
    secondary:
      "border-1 w-full arimo transition-all border-gray-400 py-3 px-2 bg-white text-sm sm:text-base hover:bg-gray-100 " +
      "hover:border-gray-500 hover:cursor-pointer",
    rounded:
      "border-1 transition-all border-gray-400 w-full py-2 px-1 rounded-full bg-white hover:bg-gray-100 arimo hover:border-gray-500 text-sm sm:text-base",
    borderless:
      "border-none bg-none yeseva m-0 text-xl m-0 py-3 hover:cursor-pointer",
  };

  const className = variant && variants[variant] ? variants[variant] : base;

  return (
    <button className={className + ` ${customClasses}`} {...props}>
      {props.children}
    </button>
  );
}

export default Button;
