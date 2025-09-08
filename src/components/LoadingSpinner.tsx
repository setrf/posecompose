import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  showGlow?: boolean;
}

export const LoadingSpinner = ({ 
  size = 'md', 
  text,
  showGlow = false 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`relative ${showGlow ? 'animate-pulse-glow' : ''}`}>
        <Loader2 
          className={`${sizeClasses[size]} animate-spin text-primary ${
            showGlow ? 'drop-shadow-[0_0_10px_hsl(var(--primary))]' : ''
          }`} 
        />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-fade-in">
          {text}
        </p>
      )}
    </div>
  );
};