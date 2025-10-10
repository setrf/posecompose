import React from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingLabelInput = ({ label, error, className, ...props }: FloatingLabelInputProps) => {
  const [focused, setFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    setHasValue(e.target.value.length > 0);
  };

  return (
    <div className="relative">
      <input
        {...props}
        className={cn(
          "w-full px-4 py-3 border rounded-lg bg-background transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "hover:border-primary/30",
          error ? "border-destructive" : "border-border",
          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder=""
      />
      
      {/* Floating Label */}
      <label
        className={cn(
          "absolute left-4 transition-all duration-300 pointer-events-none",
          focused || hasValue || props.value
            ? "top-2 text-xs text-primary font-medium"
            : "top-3 text-base text-muted-foreground"
        )}
      >
        {label}
      </label>

      {/* Focus Ring Animation */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg border-2 border-transparent transition-all duration-300 pointer-events-none",
          focused && "border-primary/30 animate-pulse-glow"
        )}
      />

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-destructive animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

interface PulseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const PulseButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  className, 
  ...props 
}: PulseButtonProps) => {
  const variants = {
    primary: "bg-gradient-primary text-white hover:shadow-glow",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-background hover:bg-accent"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      {...props}
      className={cn(
        "relative overflow-hidden rounded-lg font-medium transition-all duration-300",
        "hover:scale-[1.02] active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variants[variant],
        sizes[size],
        loading && "cursor-wait",
        className
      )}
    >
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
      
      {/* Loading Pulse */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 animate-pulse" />
      )}
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </span>
    </button>
  );
};

interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export const InteractiveCard = ({ children, onClick, selected, className }: InteractiveCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card transition-all duration-300",
        "hover:shadow-card-hover hover:scale-[1.02]",
        onClick && "cursor-pointer",
        selected && "ring-2 ring-primary bg-gradient-accent shadow-elegant animate-pulse-glow",
        className
      )}
    >
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      
      {/* Selection Glow */}
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-pulse" />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface LoadingDotsProps {
  className?: string;
}

export const LoadingDots = ({ className }: LoadingDotsProps) => {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-current rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
};

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const ProgressRing = ({ 
  progress, 
  size = 40, 
  strokeWidth = 4, 
  className 
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      
      {/* Center Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};
