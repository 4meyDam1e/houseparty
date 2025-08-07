import { MdErrorOutline } from "react-icons/md";
import { cn } from "../utils";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

interface InputNumberProps {
  value: string;
  defaultValue: string;
  onChange: (value: React.SetStateAction<number>) => void;
  placeholderText?: string;
  error?: boolean;
  helperText?: string;
}

const InputNumber = ({
  value,
  defaultValue,
  onChange,
  placeholderText,
  error,
  helperText,
}: InputNumberProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(prev => {
      const newValue = parseInt(e.target.value);
      return !isNaN(newValue) ? newValue : prev
    });
  };

  const increment = () => {
    onChange(prev => prev + 1);
  };

  const decrement = () => {
    onChange(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="flex flex-col justify-between items-start w-full gap-y-1.5">
      <div className="relative w-full">
        <input
          className={cn(
            "relative px-3 py-3 border focus-visible:outline-none rounded-md placeholder-gray-500 text-primary-text font-medium transition duration-200",
            !error && "border-gray-400 hover:border-primary-text focus-visible:border-primary-text",
            error && "border-red-600 hover:border-red-600 focus-visible:border-red-500"
          )}
          type="text"
          placeholder={placeholderText || "Input Number"}
          value={!isNaN(parseInt(value)) ? value : defaultValue}
          onChange={handleChange}
        />

        <div className="absolute right-2 top-0 h-full flex flex-col justify-center items-center gap-y-1.5">
          <button
            onClick={increment}
            className="rounded-t-xs text-sm text-primary-text hover:text-muted-text transition duration-300"
          >
            <FaChevronUp />
          </button>

          <button
            onClick={decrement}
            className="rounded-b-xs text-sm text-primary-text hover:text-muted-text transition duration-300"
          >
            <FaChevronDown />
          </button>
        </div>
      </div>

      {helperText && (
        <div className={cn(
          "flex justify-start items-center gap-x-0.5 w-full text-sm font-medium",
          error && "text-red-400"
        )}>
          <MdErrorOutline className="text-xl" />
          <p>{helperText}</p>
        </div>
      )}
    </div>
  );
};

export default InputNumber;
