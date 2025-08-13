interface InputProps {
  placeholder?: string;
  type?: "text" | "password";
  variant?: "form" | "default";
}

function Input({ placeholder, type, variant }: InputProps) {
  return variant === "form" ? (
    <div className="relative my-2 w-full transition-all">
      <input
        id={placeholder + "Id"}
        name={placeholder}
        type={type}
        placeholder=""
        className="bg-gray-200 noto w-full p-3 pl-5 my-2 focus:outline-gray-500 peer"
      />
      <label
        htmlFor={placeholder + "Id"}
        className="absolute noto left-5 text-gray-500 cursor-text -top-2 peer-focus:left-0 not-peer-placeholder-shown:left-0 peer-focus:-top-2
        transition-all peer-placeholder-shown:top-1/2 -translate-y-1/2"
      >
        {placeholder}
      </label>
    </div>
  ) : (
    <input
      className="bg-gray-200 p-3 pl-5 my-2 focus:outline-gray-500 noto"
      type={type ?? "text"}
      placeholder={placeholder ?? "Enter info..."}
    />
  );
}

export default Input;
