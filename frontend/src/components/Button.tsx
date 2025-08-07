import { cn } from "../utils";


interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button = ({
  variant = "primary",
  children,
  onClick,
  className,
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "px-4 py-3 rounded-full font-extrabold cursor-pointer transition duration-200",
        variant === "primary" && "text-background bg-primary-green hover:bg-secondary-green",
        variant === "secondary" && "border border-gray-500 hover:border-primary-text",
        className
      )}
      onClick={onClick || (() => {})}
    >
      {children}
    </button>
  );
};

export default Button;
