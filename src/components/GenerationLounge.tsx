import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Sparkles, Image, Wand2, Gift, Star } from 'lucide-react';
import { CostumePreset } from '@/types/costume';
import { logEvent } from '@/lib/logger';

interface GenerationLoungeProps {
  selectedCostume: CostumePreset;
  userEmail?: string;
  onComplete: (imageUrl: string) => void;
}

interface GenerationProgress {
  stage: string;
  progress: number;
  message: string;
  icon: React.ReactNode;
}

export const GenerationLounge = ({ selectedCostume, userEmail, onComplete }: GenerationLoungeProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(selectedCostume.metadata.estimatedProcessingTime);

  const stages: GenerationProgress[] = useMemo(() => [
    {
      stage: 'Upload',
      progress: 20,
      message: 'Analyzing your selfie...',
      icon: <Image className="w-4 h-4" />
    },
    {
      stage: 'Background',
      progress: 40,
      message: 'Removing background with AI magic...',
      icon: <Zap className="w-4 h-4" />
    },
    {
      stage: 'Costume',
      progress: 70,
      message: 'Applying ' + selectedCostume.name + ' transformation...',
      icon: <Wand2 className="w-4 h-4" />
    },
    {
      stage: 'Polish',
      progress: 90,
      message: 'Adding magical touches...',
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      stage: 'Complete',
      progress: 100,
      message: 'Your transformation is ready!',
      icon: <Star className="w-4 h-4" />
    }
  ], [selectedCostume.name]);

  useEffect(() => {
    logEvent('generation_lounge_entered', {
      costumeId: selectedCostume.id,
      costumeName: selectedCostume.name,
      userEmail: userEmail || 'guest'
    });

    // Simulate generation progress
    const totalDuration = estimatedTime * 1000; // Convert to milliseconds
    const stageDuration = totalDuration / stages.length;
    
    stages.forEach((stage, index) => {
      setTimeout(() => {
        setCurrentStage(index);
        setProgress(stage.progress);
        logEvent('generation_stage_updated', {
          stage: stage.stage,
          progress: stage.progress,
          costumeId: selectedCostume.id
        });

        // If this is the final stage, simulate completion
        if (index === stages.length - 1) {
          setTimeout(() => {
            // In a real implementation, this would receive the actual generated image
            const mockGeneratedImage = `data:image/svg+xml,%3Csvg width='400' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23${selectedCostume.colors.primary.substring(1)}' width='400' height='600'/%3E%3Ctext x='200' y='300' text-anchor='middle' fill='white' font-family='Arial' font-size='24'${selectedCostume.name} Transformation%3C/text%3E%3C/svg%3E`;
            
            logEvent('generation_completed', {
              costumeId: selectedCostume.id,
              costumeName: selectedCostume.name,
              durationMs: estimatedTime * 1000,
              userEmail: userEmail || 'guest'
            });
            
            onComplete(mockGeneratedImage);
          }, stageDuration);
        }
      }, index * stageDuration);
    });

    // Update countdown timer
    const timeInterval = setInterval(() => {
      setEstimatedTime(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [selectedCostume, userEmail, estimatedTime, onComplete, stages]);

  const activeStage = stages[currentStage];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-pulse">
            <Wand2 className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-bold gradient-text">
            Magic in Progress ✨
          </h2>
          <p className="text-muted-foreground">
            Transforming into {selectedCostume.name}...
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              {estimatedTime}s remaining
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Transformation Progress</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Stages */}
          <div className="space-y-3">
            {stages.map((stage, index) => (
              <div
                key={stage.stage}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  index <= currentStage
                    ? index === currentStage
                      ? 'bg-primary/10 border border-primary/25'
                      : 'bg-muted/50'
                    : 'opacity-50'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  index <= currentStage
                    ? index === currentStage
                      ? 'bg-primary animate-pulse'
                      : 'bg-primary/50'
                    : 'bg-muted'
                }`}>
                  {stage.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      index <= currentStage ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {stage.stage}
                    </span>
                    {index <= currentStage && (
                      <span className="text-xs text-muted-foreground">
                        {stage.progress}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stage.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Costume Info */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl">🎭</span>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{selectedCostume.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedCostume.marketing.shortDescription}
            </p>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedCostume.metadata.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Fun Facts */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Did You Know?
        </h3>
        
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            🎃 Over 10,000 people have transformed themselves this Halloween season
          </p>
          <p>
            🤖 Our AI analyzes over 100 facial features to create the perfect fit
          </p>
          <p>
            ✨ Each transformation is unique - no two are exactly alike!
          </p>
          <p>
            🎁 New costume collections drop every week for our community members
          </p>
        </div>
      </Card>

      {/* Affiliate Promotion */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-5 h-5 text-purple-600" />
          <h4 className="font-semibold text-purple-900">Love Your Transformation?</h4>
        </div>
        <p className="text-sm text-purple-800 mb-3">
          Get the real {selectedCostume.name} costume from our partners and complete the look!
        </p>
        <div className="text-xs text-purple-700">
          Partner links help keep our AI transformations free for everyone ❤️
        </div>
      </div>

      {/* User Info */}
      {userEmail && (
        <div className="text-center text-sm text-muted-foreground">
          <p>Transformation being sent to: {userEmail}</p>
        </div>
      )}
    </div>
  );
};
