import { type ComponentProps, useState } from "react";

type InputProps = ComponentProps<"input"> & {
  placeholder?: string;
  type?: "text" | "password" | "number" | "date";
  customClasses?: string;
};

function Input({ placeholder, type, customClasses, ...props }: InputProps) {
  const [isVisible, setVisibility] = useState(false);

  function handleShowPasswordButton() {
    setVisibility((prev) => !prev);
  }

  return type === "number" ? (
    <div className="relative my-2 w-full transition-all">
      <input
        id={placeholder + "Id"}
        name={placeholder}
        type={type}
        placeholder=""
        className={
          "[&::-webkit-inner-spin-button]:appearance-none\n" +
          "    [&::-webkit-outer-spin-button]:appearance-none\n" +
          "    [&::-moz-appearance]:textfield" +
          `bg-gray-200 noto w-full p-3 pl-5 my-2 focus:outline-gray-500 peer outline-none` +
          ` ${customClasses}`
        }
        onInput={(e) => {
          e.currentTarget.value = e.currentTarget.value
            .replace(/[^0-9]/g, "")
            .slice(0, 8);
        }}
        {...props}
      />
      <label
        htmlFor={placeholder + "Id"}
        className="absolute noto left-5 text-gray-500 cursor-text -top-2 peer-focus:left-0
        not-peer-placeholder-shown:left-0 peer-focus:text-sm not-peer-placeholder-shown:text-sm peer-focus:-top-2
        transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-black -translate-y-1/2"
      >
        {placeholder}
      </label>
    </div>
  ) : type === "date" ? (
    <input
      type={type}
      className="bg-white noto px-5 py-3 min-h-12 cursor-pointer transition-all outline-none"
      {...props}
    />
  ) : (
    <div className="relative my-2 w-full transition-all">
      <input
        id={placeholder + "Id"}
        name={placeholder}
        type={type === "password" ? (isVisible ? "text" : "password") : type}
        placeholder=""
        className={
          `bg-gray-200 noto w-full p-3 pl-5 my-2 focus:outline-gray-500 peer outline-none` +
          ` ${customClasses}`
        }
        {...props}
      />
      <button
        onClick={handleShowPasswordButton}
        className={`absolute right-5 top-5 transition-all hover:bg-gray-300 rounded-sm p-px ${type === "password" ? "" : "hidden"}`}
      >
        <img
          alt="eye"
          src={
            isVisible ? "public/Icons/eye.svg" : "public/Icons/eye-slash.svg"
          }
          className="w-6 h-6"
        />
      </button>
      <label
        htmlFor={placeholder + "Id"}
        className="absolute noto left-5 text-gray-500 cursor-text -top-2 peer-focus:left-0
        not-peer-placeholder-shown:left-0 peer-focus:text-sm not-peer-placeholder-shown:text-sm peer-focus:-top-2
        transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-black -translate-y-1/2"
      >
        {placeholder}
      </label>
    </div>
  );
}

export default Input;
