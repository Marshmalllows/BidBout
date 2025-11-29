import { type ComponentProps, useState } from "react";

type InputProps = ComponentProps<"input"> & {
  placeholder?: string;
  type?: "text" | "password" | "number" | "date" | "search";
  customClasses?: string;
  font?: string;
};

function Input({
  placeholder,
  type,
  customClasses,
  font,
  ...props
}: InputProps) {
  const [isVisible, setVisibility] = useState(false);

  function handleShowPasswordButton() {
    setVisibility((prev) => !prev);
  }

  const labelClasses = `absolute ${font ?? "noto"} left-5 cursor-text -top-3.5 peer-focus:left-0
        not-peer-placeholder-shown:left-0 peer-focus:text-sm not-peer-placeholder-shown:text-sm peer-focus:-top-3.5
        transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-black -translate-y-1/2 pointer-events-none`;

  const baseInputClasses = `bg-gray-200 ${font ?? "noto"} w-full p-3 pl-5 focus:outline-gray-500 peer outline-none h-[52px] transition-all`;

  if (type === "number") {
    return (
      <div className="relative w-full">
        <input
          id={placeholder + "Id"}
          name={placeholder}
          type={type}
          placeholder=" "
          className={
            "[&::-webkit-inner-spin-button]:appearance-none " +
            "[&::-webkit-outer-spin-button]:appearance-none " +
            "[&::-moz-appearance]:textfield " +
            `${baseInputClasses} ${customClasses}`
          }
          onInput={(e) => {
            if (e.currentTarget.value.length > 8) {
              e.currentTarget.value = e.currentTarget.value.slice(0, 8);
            }
          }}
          {...props}
        />
        <label htmlFor={placeholder + "Id"} className={labelClasses}>
          {placeholder}
        </label>
      </div>
    );
  }

  if (type === "date") {
    return (
      <div className="w-full">
        <input
          type={type}
          // Додаємо h-[52px], щоб висота була ідентична текстовим полям
          className={`bg-white ${font ?? "noto"} px-5 py-3 h-[52px] cursor-pointer w-full outline-none border-gray-200 ${customClasses}`}
          {...props}
        />
      </div>
    );
  }

  if (type === "search") {
    return (
      <div className="flex flex-col relative w-full">
        <input
          type="text"
          placeholder={placeholder}
          className={`bg-white px-5 py-3 outline-none ${font ?? "noto"} pl-12 h-[52px]`}
          {...props}
        />
        <button
          type="submit"
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all hover:bg-gray-200 rounded-sm p-1`}
        >
          <img
            alt="magnifying-glass"
            src="/Icons/magnifying-glass.svg"
            className="w-6 h-6"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <input
        id={placeholder + "Id"}
        name={placeholder}
        type={type === "password" ? (isVisible ? "text" : "password") : type}
        placeholder=" "
        className={`${baseInputClasses} ${customClasses}`}
        {...props}
      />

      {type === "password" && (
        <button
          type="button"
          onClick={handleShowPasswordButton}
          className="absolute right-5 top-1/2 -translate-y-1/2 transition-all hover:bg-gray-300 rounded-sm p-1"
        >
          <img
            alt="eye"
            src={isVisible ? "/Icons/eye.svg" : "/Icons/eye-slash.svg"}
            className="w-6 h-6"
          />
        </button>
      )}

      <label htmlFor={placeholder + "Id"} className={labelClasses}>
        {placeholder}
      </label>
    </div>
  );
}

export default Input;
