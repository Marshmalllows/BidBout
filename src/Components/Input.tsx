interface InputProps {
  placeholder?: string;
  type?: "text" | "password";
}

function Input({ placeholder, type }: InputProps) {
  return (
    <input
      className="bg-gray-200 p-3 pl-5 my-2 focus:outline-gray-500"
      type={type ?? "text"}
      placeholder={placeholder ?? "Enter info..."}
    />
  );
}

export default Input;
