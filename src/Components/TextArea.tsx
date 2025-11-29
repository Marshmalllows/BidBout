import {
  useState,
  useRef,
  useEffect,
  type TextareaHTMLAttributes,
  type ChangeEvent,
} from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  placeholder?: string;
  font?: string;
  customClasses?: string;
};

function TextArea({
  placeholder,
  font,
  customClasses,
  value: externalValue,
  onChange: externalOnChange,
  ...props
}: TextareaProps) {
  const [internalValue, setInternalValue] = useState("");
  const isControlled = externalValue !== undefined;
  const currentValue = isControlled ? externalValue : internalValue;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [currentValue]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    if (externalOnChange) {
      externalOnChange(e);
    }
  };

  return (
    <div className="relative w-full transition-all">
      <textarea
        id={placeholder + "Id"}
        name={placeholder}
        placeholder=" "
        value={currentValue}
        rows={1}
        ref={textareaRef}
        onChange={handleChange}
        className={`bg-gray-200 ${font ?? "noto"} w-full p-3 pl-5 focus:outline-gray-500 peer outline-none resize-none min-h-[52px] overflow-hidden ${customClasses}`}
        {...props}
      />

      <label
        htmlFor={placeholder + "Id"}
        className={`absolute ${font ?? "noto"} left-5 cursor-text -top-5 peer-focus:left-0
        not-peer-placeholder-shown:left-0 peer-focus:text-sm not-peer-placeholder-shown:text-sm peer-focus:-top-6
        not-peer-placeholder-shown:-top-6
        transition-all 
        peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-black pointer-events-none`}
      >
        {placeholder}
      </label>
    </div>
  );
}

export default TextArea;
