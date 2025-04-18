
import { useAppContext } from "@/context/AppContext";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Logo = ({ size = "md", className }: LogoProps) => {
  const { theme } = useAppContext();
  
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-14 w-14"
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 240 240" 
        xmlns="http://www.w3.org/2000/svg"
        className={sizes[size]}
      >
        {/* Outer light blue circle */}
        <circle cx="120" cy="120" r="120" fill="#D9F2FA" />
        
        {/* Middle green circle */}
        <circle cx="120" cy="120" r="95" fill="#24C172" />
        
        {/* Location pin icon */}
        <path
          d="M120 70c-22 0-40 18-40 40 0 30 40 60 40 60s40-30 40-60c0-22-18-40-40-40zm0 54c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z"
          fill="white"
        />
        
        {/* Base ellipse */}
        <ellipse cx="120" cy="170" rx="25" ry="5" fill="white" />
      </svg>
    </div>
  );
};
