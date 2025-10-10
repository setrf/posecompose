import { CheckCircle, Circle, Sparkles, Mail, Camera, Wand2, Trophy } from "lucide-react";

interface StepIndicatorProps {
  currentStep: 'background' | 'upload' | 'select' | 'generate' | 'result' | 'costume' | 'email';
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  // New costume transformation flow
  const costumeSteps = [
    { id: 'costume', label: 'Costume', number: 1, icon: <Sparkles className="w-5 h-5" /> },
    { id: 'email', label: 'Email', number: 2, icon: <Mail className="w-5 h-5" /> },
    { id: 'upload', label: 'Selfie', number: 3, icon: <Camera className="w-5 h-5" /> },
    { id: 'generate', label: 'Magic', number: 4, icon: <Wand2 className="w-5 h-5" /> },
    { id: 'result', label: 'Result', number: 5, icon: <Trophy className="w-5 h-5" /> },
  ];

  // Original group photo flow (for backwards compatibility)
  const groupSteps = [
    { id: 'background', label: 'Background', number: 1, icon: <Circle className="w-5 h-5" /> },
    { id: 'upload', label: 'Add People', number: 2, icon: <Circle className="w-5 h-5" /> },
    { id: 'select', label: 'Select & Arrange', number: 3, icon: <Circle className="w-5 h-5" /> },
    { id: 'generate', label: 'Generate', number: 4, icon: <Circle className="w-5 h-5" /> },
    { id: 'result', label: 'Result', number: 5, icon: <Circle className="w-5 h-5" /> },
  ];

  const steps = costumeSteps.find(s => s.id === currentStep) ? costumeSteps : groupSteps;

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between relative animate-fade-in">
        {/* Progress line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-white/20">
          <div 
            className="h-full bg-white/60 transition-all duration-500 ease-out shadow-sm"
            style={{ 
              width: `${Math.max(0, (getCurrentStepIndex() / (steps.length - 1)) * 100)}%` 
            }}
          />
        </div>

        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = getCurrentStepIndex() > index;
          const isNext = getCurrentStepIndex() === index - 1;

          return (
            <div 
              key={step.id} 
              className="flex flex-col items-center relative z-10 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-300 transform shadow-lg
                  ${isActive ? 'bg-white text-primary scale-110 shadow-glow animate-pulse-glow' : ''}
                  ${isCompleted ? 'bg-success text-white shadow-md' : ''}
                  ${!isActive && !isCompleted ? 'bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white font-semibold' : ''}
                  ${isNext ? 'border-white/60 scale-105 bg-white/10' : ''}
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : isActive && 'icon' in step ? (
                  <div className="text-primary">{step.icon}</div>
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              
              <div className="mt-3 text-center">
                <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
                  <p 
                    className={`
                      text-xs font-semibold transition-all duration-300 text-white drop-shadow-sm
                      ${isActive ? 'font-bold' : ''}
                      ${isCompleted ? 'text-green-100' : ''}
                      ${!isActive && !isCompleted ? 'text-white/90' : ''}
                    `}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};