import {
  useState,
  useRef,
  useEffect,
  type TextareaHTMLAttributes,
} from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  placeholder?: string;
  font?: string;
  customClasses?: string;
};

function Textarea({
  placeholder,
  font,
  customClasses,
  ...props
}: TextareaProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Автопідлаштування висоти
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <div className="relative my-4 w-full transition-all">
      <textarea
        id={placeholder + "Id"}
        name={placeholder}
        placeholder=""
        value={value}
        rows={1}
        onChange={(e) => setValue(e.target.value)}
        ref={textareaRef}
        className={`bg-gray-200 ${font ?? "noto"} w-full p-3 pl-5 focus:outline-gray-500 peer outline-none resize-none min-h-[3rem] ${customClasses}`}
        {...props}
      />
      <label
        htmlFor={placeholder + "Id"}
        className={`absolute ${font ?? "noto"} left-5 cursor-text -top-4 peer-focus:left-0
        not-peer-placeholder-shown:left-0 peer-focus:text-sm not-peer-placeholder-shown:text-sm peer-focus:-top-4
        transition-all peer-placeholder-shown:top-[24px] peer-placeholder-shown:text-black -translate-y-1/2`}
      >
        {placeholder}
      </label>
    </div>
  );
}

export default Textarea;
