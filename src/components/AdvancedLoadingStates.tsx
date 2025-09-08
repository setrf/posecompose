import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2, Clock, Sparkles, Users, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  duration: number; // in milliseconds
}

interface AdvancedLoadingStatesProps {
  className?: string;
}

const loadingSteps: LoadingStep[] = [
  {
    id: 'background',
    title: 'Analyzing Background',
    description: 'Understanding the scene and lighting conditions',
    icon: Image,
    duration: 2000
  },
  {
    id: 'processing',
    title: 'Processing People',
    description: 'Removing backgrounds and preparing subjects',
    icon: Users,
    duration: 3000
  },
  {
    id: 'composing',
    title: 'Composing Scene',
    description: 'Positioning people and matching lighting',
    icon: Sparkles,
    duration: 4000
  },
  {
    id: 'finalizing',
    title: 'Finalizing Image',
    description: 'Adding finishing touches and optimizing quality',
    icon: CheckCircle2,
    duration: 2000
  }
];

export const AdvancedLoadingStates = ({ className }: AdvancedLoadingStatesProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = loadingSteps.reduce((sum, step) => sum + step.duration, 0);
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);
      
      // Calculate which step should be current based on elapsed time
      let accumulatedTime = 0;
      let newCurrentIndex = 0;
      
      for (let i = 0; i < loadingSteps.length; i++) {
        if (elapsed > accumulatedTime + loadingSteps[i].duration) {
          setCompletedSteps(prev => new Set([...prev, loadingSteps[i].id]));
          newCurrentIndex = i + 1;
        } else if (elapsed > accumulatedTime) {
          newCurrentIndex = i;
          break;
        }
        accumulatedTime += loadingSteps[i].duration;
      }
      
      setCurrentStepIndex(Math.min(newCurrentIndex, loadingSteps.length - 1));
      
      if (elapsed >= totalDuration) {
        setCompletedSteps(new Set(loadingSteps.map(step => step.id)));
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("text-center py-16 space-y-8", className)}>
      {/* Main Loading Spinner */}
      <div className="relative">
        <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto drop-shadow-[0_0_20px_hsl(var(--primary))]" />
        <div className="absolute inset-0 animate-pulse-glow">
          <div className="w-20 h-20 border-2 border-primary/20 rounded-full mx-auto -mt-2 animate-ping"></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Step Display */}
      <div className="space-y-4 animate-fade-in">
        <h3 className="font-display text-3xl font-semibold gradient-text">
          Creating Your Group Photo
        </h3>
        
        {loadingSteps[currentStepIndex] && (
          <div className="space-y-2 animate-scale-in">
            <div className="flex items-center justify-center space-x-3">
              {React.createElement(loadingSteps[currentStepIndex].icon, {
                className: "w-6 h-6 text-primary animate-pulse"
              })}
              <h4 className="text-xl font-medium">
                {loadingSteps[currentStepIndex].title}
              </h4>
            </div>
            <p className="text-muted-foreground">
              {loadingSteps[currentStepIndex].description}
            </p>
          </div>
        )}
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center space-x-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {loadingSteps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = index === currentStepIndex;
          
          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center space-y-2 transition-all duration-500",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                isCompleted 
                  ? "bg-success text-success-foreground shadow-lg scale-110" 
                  : isCurrent 
                    ? "bg-primary text-primary-foreground animate-pulse shadow-lg scale-105" 
                    : "bg-muted text-muted-foreground"
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>
              <div className="text-center">
                <div className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  isCompleted 
                    ? "text-success" 
                    : isCurrent 
                      ? "text-primary" 
                      : "text-muted-foreground"
                )}>
                  {step.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fun Loading Messages */}
      <div className="max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>✨ AI is working its magic...</p>
          <p>This usually takes 10-15 seconds for best results</p>
        </div>
      </div>
    </div>
  );
};