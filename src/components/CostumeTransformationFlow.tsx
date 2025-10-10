import { useCallback, useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CostumeSelection } from './CostumeSelection';
import { EmailCapture } from './EmailCapture';
import { GenerationLounge } from './GenerationLounge';
import { TransformationResult } from './TransformationResult';
import { CostumePreset } from '@/types/costume';
import { logEvent, logError } from '@/lib/logger';
import { toast } from 'sonner';

export interface TransformStep {
  current: 'costume' | 'email' | 'upload' | 'generating' | 'result';
}

const now = () => (typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now());

const createSessionId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const CostumeTransformationFlow = () => {
  const [selectedCostume, setSelectedCostume] = useState<CostumePreset | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<TransformStep['current']>('costume');
  const [uploadedSelfie, setUploadedSelfie] = useState<File | null>(null);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const sessionIdRef = useRef<string>("");
  const sessionStartRef = useRef<number>(now());
  const transformationStartRef = useRef<number | null>(null);

  const logInfo = useCallback(
    (event: string, payload: Record<string, unknown> = {}) => {
      logEvent(event, {
        sessionId: sessionIdRef.current,
        elapsedMs: Math.round(now() - sessionStartRef.current),
        ...payload,
      });
    },
    []
  );

  const logFailure = useCallback(
    (event: string, error: unknown, payload: Record<string, unknown> = {}) => {
      logError(event, error, {
        sessionId: sessionIdRef.current,
        elapsedMs: Math.round(now() - sessionStartRef.current),
        ...payload,
      });
    },
    []
  );

  const startSession = useCallback(
    (reason: string) => {
      sessionIdRef.current = createSessionId();
      sessionStartRef.current = now();
      logEvent("costume_transformation_session_started", {
        sessionId: sessionIdRef.current,
        elapsedMs: 0,
        reason,
      });
    },
    []
  );

  useEffect(() => {
    startSession("mount");
  }, [startSession]);

  useEffect(() => {
    if (!sessionIdRef.current) {
      return;
    }
    logInfo("costume_transformation_step_changed", { step: currentStep });
  }, [currentStep, logInfo]);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCostumeSelect = (costume: CostumePreset) => {
    setSelectedCostume(costume);
    setCurrentStep('email');
    toast.success(`Perfect choice! Now let's get your email to save your amazing ${costume.name} transformation.`);
  };

  const handleEmailSubmit = (email: string, consent: boolean) => {
    setUserEmail(email);
    setMarketingConsent(consent);
    setCurrentStep('upload');
    toast.success('Great! Now upload your selfie to begin the transformation magic.');
  };

  const handleEmailSkip = () => {
    setUserEmail(undefined);
    setMarketingConsent(false);
    setCurrentStep('upload');
    toast.success('No problem! Upload your selfie to begin your transformation.');
  };

  const handleSelfieUpload = async (file: File) => {
    if (!selectedCostume) {
      toast.error('Please select a costume first!');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Convert selfie to base64
      const base64 = await fileToBase64(file);
      const url = `data:image/jpeg;base64,${base64}`;
      
      setUploadedSelfie(file);
      setSelfieUrl(url);
      
      logInfo('selfie_uploaded', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        costumeId: selectedCostume.id,
      });

      // Immediately start generation after upload
      setCurrentStep('generating');
      toast.success('Selfie uploaded! Starting your magical transformation...');
      
    } catch (error) {
      logFailure('selfie_upload_failed', error, {
        fileName: file.name,
        costumeId: selectedCostume?.id,
      });
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerationComplete = (imageUrl: string) => {
    setGeneratedImage(imageUrl);
    setCurrentStep('result');
    
    const transformationDuration = transformationStartRef.current 
      ? Math.round(now() - transformationStartRef.current) 
      : undefined;
    
    logInfo('costume_transformation_completed', {
      costumeId: selectedCostume?.id,
      costumeName: selectedCostume?.name,
      durationMs: transformationDuration,
      marketingConsent,
      transformationStartedAt: transformationStartRef.current,
    });
    
    toast.success('🎉 Your transformation is complete! Share it with the world!');
  };

  const handleStartOver = () => {
    logInfo('transformation_restart_requested', {
      costumeId: selectedCostume?.id,
      userEmail: userEmail,
    });
    
    setSelectedCostume(null);
    setUserEmail(undefined);
    setMarketingConsent(false);
    setCurrentStep('costume');
    setUploadedSelfie(null);
    setSelfieUrl(null);
    setGeneratedImage(null);
    setIsProcessing(false);
    startSession("restart");
  };

  const handleSaveAnother = () => {
    logInfo('transformation_another_started', {
      previousCostumeId: selectedCostume?.id,
      userEmail: userEmail,
      marketingConsent,
    });
    
    // Keep user info but restart from costume selection
    setCurrentStep('costume');
    setUploadedSelfie(null);
    setSelfieUrl(null);
    setGeneratedImage(null);
  };

  const handleBackToCostume = () => {
    logInfo('navigate_step', { targetStep: 'costume' });
    setCurrentStep('costume');
  };

  const handleBackToEmail = () => {
    logInfo('navigate_step', { targetStep: 'email' });
    setCurrentStep('email');
  };

  // Render appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'costume':
        return (
          <CostumeSelection
            onCostumeSelect={handleCostumeSelect}
            onBack={handleStartOver}
            selectedCostume={selectedCostume}
          />
        );

      case 'email':
        if (!selectedCostume) return null;
        return (
          <EmailCapture
            selectedCostume={selectedCostume}
            onEmailSubmit={handleEmailSubmit}
            onSkip={handleEmailSkip}
          />
        );

      case 'upload':
        if (!selectedCostume) return null;
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold gradient-text">
                Upload Your Selfie
              </h2>
              <p className="text-muted-foreground">
                Your {selectedCostume.name} transformation awaits! 📸
              </p>
            </div>

            {/* Costume Preview */}
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedCostume.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCostume.marketing.shortDescription}
                  </p>
                </div>
              </div>
            </Card>

            {/* Upload Area */}
            <Card className="p-8">
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleSelfieUpload(file);
                    }
                  }}
                  className="hidden"
                  id="selfie-upload"
                />
                
                <label 
                  htmlFor="selfie-upload" 
                  className="cursor-pointer block space-y-4"
                >
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl">📸</span>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-purple-900">
                      {isProcessing ? 'Processing...' : 'Click to Upload Selfie'}
                    </p>
                    <p className="text-sm text-purple-700 mt-1">
                      JPG, PNG up to 10MB
                    </p>
                  </div>
                  
                  <Button 
                    type="button" 
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isProcessing ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Processing...
                      </>
                    ) : (
                      'Choose Photo'
                    )}
                  </Button>
                </label>
              </div>
            </Card>

            {/* Back Button */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBackToEmail}>
                ← Back
              </Button>
            </div>

            {/* Tips */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Photo Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Clear, well-lit photos work best</li>
                <li>• Face should be clearly visible</li>
                <li>• Simple backgrounds help with accuracy</li>
                <li>• You'll be amazed by the results! ✨</li>
              </ul>
            </Card>
          </div>
        );

      case 'generating':
        if (!selectedCostume) return null;
        return (
          <GenerationLounge
            selectedCostume={selectedCostume}
            userEmail={userEmail}
            onComplete={handleGenerationComplete}
          />
        );

      case 'result':
        if (!selectedCostume || !generatedImage) return null;
        return (
          <TransformationResult
            generatedImage={generatedImage}
            selectedCostume={selectedCostume}
            userEmail={userEmail}
            onStartOver={handleStartOver}
            onSaveAnother={handleSaveAnother}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)] opacity-50"></div>
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl md:text-6xl font-bold gradient-text mb-4 animate-fade-in glow-pulse">
              Waifu Material
            </h1>
            <p className="text-white/95 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed drop-shadow-sm animate-fade-in neon-text" style={{ animationDelay: '0.1s' }}>
              Transform yourself with stunning AI-powered costumes
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2 text-white/80 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium drop-shadow-sm neon-text">Halloween Collection 2025</span>
            </div>
          </div>

          {/* Step Progress Indicator */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-between text-sm">
              {['Costume', 'Email', 'Selfie', 'Magic', 'Result'].map((step, index) => {
                const steps = ['costume', 'email', 'upload', 'generating', 'result'] as const;
                const isActive = steps[index] === currentStep;
                const isCompleted = steps.indexOf(currentStep) > index;
                
                return (
                  <div key={step} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      isActive 
                        ? 'border-primary bg-primary text-white' 
                        : isCompleted 
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span className={`ml-2 ${
                      isActive ? 'text-primary font-semibold' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Card className="p-8 md:p-12 neon-card hover-lift animate-scale-in">
              {renderStepContent()}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostumeTransformationFlow;
