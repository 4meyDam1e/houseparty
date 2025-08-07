import { MdErrorOutline } from "react-icons/md";
import { cn } from "../utils";

interface InputProps {
  value: string;
  onChange: (value: React.SetStateAction<string>) => void;
  placeholderText?: string;
  error?: boolean;
  helperText?: string;
}

const Input = ({
  value,
  onChange,
  placeholderText,
  error,
  helperText,
}: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col justify-between items-start w-full gap-y-1.5">
      <input
        className={cn(
          "px-3 py-3 border focus-visible:outline-none rounded-md placeholder-gray-500 text-primary-text font-medium transition duration-200",
          !error && "border-gray-400 hover:border-primary-text focus-visible:border-primary-text",
          error && "border-red-600 hover:border-red-600 focus-visible:border-red-500"
        )}
        type="text"
        placeholder={placeholderText || "Input"}
        value={value}
        onChange={handleChange}
      />
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

export default Input;
