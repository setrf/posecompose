import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HALLOWEEN_COSTUMES, getFeaturedCostumes, getCostumeById } from '@/data/costumes';
import { CostumePreset } from '@/types/costume';
import { logEvent } from '@/lib/logger';
import { toast } from 'sonner';

interface CostumeSelectionProps {
  onCostumeSelect: (costume: CostumePreset) => void;
  onBack: () => void;
  selectedCostume?: CostumePreset | null;
}

export const CostumeSelection = ({ onCostumeSelect, onBack, selectedCostume }: CostumeSelectionProps) => {
  const [activeCostume, setActiveCostume] = useState<string | null>(
    selectedCostume?.id || null
  );
  
  const featuredCostumes = getFeaturedCostumes();
  const allCostumes = HALLOWEEN_COSTUMES;

  const handleCostumeSelect = (costume: CostumePreset) => {
    setActiveCostume(costume.id);
    logEvent('costume_selected', {
      costumeId: costume.id,
      costumeName: costume.name,
      category: costume.category,
      isPremium: costume.isPremium,
      isFeatured: costume.isFeatured
    });
  };

  const handleContinue = () => {
    if (activeCostume) {
      const costume = getCostumeById(activeCostume);
      if (costume) {
        onCostumeSelect(costume);
        toast.success(`${costume.name} costume ready! Now upload your selfie.`);
      }
    } else {
      toast.error('Please select a costume first!');
    }
  };

  const CostumeCard = ({ costume }: { costume: CostumePreset }) => (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
        activeCostume === costume.id 
          ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' 
          : 'hover:bg-accent'
      }`}
      onClick={() => handleCostumeSelect(costume)}
    >
      <div className="aspect-square mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center overflow-hidden">
        {costume.assets[0] ? (
          <img 
            src={costume.assets[0].url} 
            alt={costume.assets[0].description}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = '/assets/costumes/placeholder.jpg';
            }}
          />
        ) : (
          <div className="text-4xl">👻</div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{costume.name}</h3>
          <div className="flex gap-1">
            {costume.isNew && (
              <Badge variant="secondary" className="text-xs">NEW</Badge>
            )}
            {costume.isFeatured && (
              <Badge variant="default" className="text-xs bg-yellow-400 text-black">FEATURED</Badge>
            )}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {costume.marketing.shortDescription}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {costume.metadata.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="flex items-center">
              ⏱️ {costume.metadata.estimatedProcessingTime}s
            </span>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold gradient-text">Choose Your Transformation</h2>
        <p className="text-muted-foreground">
          Select a costume to begin your metamorphosis
        </p>
      </div>

      {/* Featured Costumes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold">Featured Transformations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredCostumes.map(costume => (
            <CostumeCard key={costume.id} costume={costume} />
          ))}
        </div>
      </div>

      {/* All Costumes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Halloween Costumes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCostumes.map(costume => (
            <CostumeCard key={costume.id} costume={costume} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button 
          onClick={handleContinue} 
          disabled={!activeCostume}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Upload Selfie →
        </Button>
      </div>

      {/* Affiliate Disclosure */}
      <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
        <p>
          <strong>Costume Partners:</strong> We work with affiliate partners to bring you premium costume designs. 
          Some costume purchases may earn us a small commission at no extra cost to you.
        </p>
        <p>
          All transformations are powered by AI technology. Results may vary based on photo quality and costume complexity.
        </p>
      </div>
    </div>
  );
};
