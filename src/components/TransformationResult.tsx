import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Share2, 
  Heart, 
  MessageCircle, 
  Twitter, 
  Instagram,
  Facebook,
  Gift,
  Star,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CostumePreset } from '@/types/costume';
import { logEvent } from '@/lib/logger';
import { toast } from 'sonner';

interface TransformationResultProps {
  generatedImage: string;
  selectedCostume: CostumePreset;
  userEmail?: string;
  onStartOver: () => void;
  onSaveAnother: () => void;
}

export const TransformationResult = ({ 
  generatedImage, 
  selectedCostume, 
  userEmail,
  onStartOver, 
  onSaveAnother 
}: TransformationResultProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      logEvent('transformation_download_started', {
        costumeId: selectedCostume.id,
        costumeName: selectedCostume.name,
        userEmail: userEmail || 'guest'
      });

      // Create download link
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `waifu-material-${selectedCostume.id}-transformation.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      logEvent('transformation_download_completed', {
        costumeId: selectedCostume.id,
        costumeName: selectedCostume.name
      });

      toast.success('🎉 Transformation downloaded!');
    } catch (error) {
      logEvent('transformation_download_failed', {
        costumeId: selectedCostume.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      toast.error('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async (platform: string) => {
    setIsSharing(true);
    
    try {
      const shareText = `🎃 Just transformed into ${selectedCostume.name} with Waifu Material! ✨ ${selectedCostume.marketing.callToAction} - Try it yourself! 🎭`;
      const shareUrl = window.location.href;
      let shareLink = '';

      switch (platform) {
        case 'twitter':
          shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=WaifuMaterial,Halloween,AICostume`;
          break;
        case 'facebook':
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
          break;
        case 'copy':
          await navigator.clipboard.writeText(`${shareText}\n\nCreate your own transformation: ${shareUrl}`);
          toast.success('🔗 Share link + costume info copied!');
          logEvent('transformation_link_copied', {
            costumeId: selectedCostume.id,
            costumeName: selectedCostume.name
          });
          return;
      }

      if (shareLink) {
        window.open(shareLink, '_blank', 'width=600,height=400');
        logEvent('transformation_shared', {
          platform,
          costumeId: selectedCostume.id,
          costumeName: selectedCostume.name
        });
        toast.success(`🎉 Shared to ${platform}! Share your transformation with #WaifuMaterial`);
      }
    } catch (error) {
      logEvent('transformation_share_failed', {
        platform,
        costumeId: selectedCostume.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      toast.error('Share failed. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  

  const handleLike = () => {
    logEvent('transformation_liked', {
      costumeId: selectedCostume.id,
      costumeName: selectedCostume.name
    });
    toast.success('❤️ Thanks for the love!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-3xl font-bold gradient-text">
            Transformation Complete! 🎉
          </h2>
          <p className="text-muted-foreground text-lg">
            You look amazing as {selectedCostume.name}!
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            Premium AI Transformation
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {selectedCostume.name}
          </Badge>
        </div>
      </div>

      {/* Result Image */}
      <Card className="p-6">
        <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden">
          <img 
            src={generatedImage}
            alt={`${selectedCostume.name} transformation`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
            AI Generated
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? 'Downloading...' : 'Download Image'}
        </Button>
        
        <Button
          onClick={() => handleShare('copy')}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Share2 className="w-4 h-4" />
          Copy Share Link
        </Button>
      </div>

      {/* Social Sharing */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share Your Transformation
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={() => handleShare('twitter')}
            variant="outline"
            className="flex items-center gap-2 justify-center"
            disabled={isSharing}
          >
            <Twitter className="w-4 h-4 text-blue-400" />
            Twitter
          </Button>
          
          <Button
            onClick={() => handleShare('facebook')}
            variant="outline"
            className="flex items-center gap-2 justify-center"
            disabled={isSharing}
          >
            <Facebook className="w-4 h-4 text-blue-600" />
            Facebook
          </Button>
          
          <Button
            onClick={handleLike}
            variant="outline"
            className="flex items-center gap-2 justify-center"
          >
            <Heart className="w-4 h-4 text-red-500" />
            Love It
          </Button>
        </div>
      </Card>

      {/* Costume Details */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-600" />
            {selectedCostume.name} Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-purple-900 mb-2">Description</h4>
              <p className="text-sm text-purple-800">
                {selectedCostume.description}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-purple-900 mb-2">Perfect For</h4>
              <div className="flex flex-wrap gap-1">
                {selectedCostume.metadata.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-purple-800">
            <span className="flex items-center gap-1">
              ⏱️ {selectedCostume.metadata.estimatedProcessingTime}s
            </span>
            <span className="flex items-center gap-1">
              🎯 {selectedCostume.metadata.difficulty} difficulty
            </span>
            <span className="flex items-center gap-1">
              ⭐ {selectedCostume.metadata.popularityScore}/10 popularity
            </span>
          </div>
        </div>
      </Card>

      {/* Affiliate Links */}
      {selectedCostume.affiliateLinks.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300">
          <div className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift className="w-6 h-6 text-purple-600" />
                <h3 className="font-bold text-lg text-purple-900">
                  Complete Your IRL Look!
                </h3>
              </div>
              <p className="text-purple-800">
                Transform your AI creation into reality with authentic {selectedCostume.name} costumes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedCostume.affiliateLinks.map(link => (
                <div 
                  key={link.id}
                  className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-purple-200 hover:bg-white/70 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-purple-600 text-white rounded font-medium">
                        {link.source}
                      </span>
                      {link.availability === 'in-stock' && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded font-medium">
                          ✅ In Stock
                        </span>
                      )}
                      {link.availability === 'pre-order' && (
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-medium">
                          ⏳ Pre-Order
                        </span>
                      )}
                      {link.price && (
                        <span className="text-sm font-bold text-purple-900">
                          💰 {link.price}
                        </span>
                      )}
                    </div>
                    
                    <h5 className="font-medium text-purple-900 text-sm">
                      {link.label}
                    </h5>
                    
                    {link.description && (
                      <p className="text-xs text-purple-700">
                        {link.description}
                      </p>
                    )}
                    
                    <Button
                      onClick={() => {
                        logEvent('affiliate_link_clicked', {
                          linkId: link.id,
                          source: link.source,
                          costumeId: selectedCostume.id,
                          costumeName: selectedCostume.name,
                          price: link.price,
                          userEmail: userEmail || 'guest'
                        });
                        window.open(link.url, '_blank', 'noopener,noreferrer');
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      size="sm"
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Shop Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <h5 className="font-semibold text-amber-900 text-xs mb-2">💝 Affiliate Disclosure</h5>
              <p className="text-xs text-amber-800 leading-relaxed">
                Waifu Material contains affiliate links. When you purchase through our partner links, 
                we may earn a small commission at no additional cost to you. This helps us keep our 
                AI transformation service free for everyone. We only recommend products that enhance 
                your cosplay experience.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* More Transformations */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h3 className="font-semibold text-lg">
            Ready for More Magic?
          </h3>
          <p className="text-muted-foreground">
            Transform into another character or start a new photoshoot
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={onSaveAnother}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Transform Again
            </Button>
            
            <Button 
              onClick={onStartOver}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <MessageCircle className="w-4 h-4" />
              Get Costumes For Friends
            </Button>
          </div>
        </div>
      </Card>

      {/* Community & Social CTAs */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">
            🎭 Join the Waifu Material Community! 🎭
          </p>
          <p className="text-xs text-muted-foreground">
            Tag us with #WaifuMaterial and follow @WaifuMaterial for daily AI costume magic! ✨
          </p>
        </div>
        
        <div className="flex justify-center gap-2 flex-wrap">
          {['🎃 Amazing!', '✨ So magical!', '💜 Love my look!', '🎭 Perfect fit!', '🔥 Obsessed!'].map((reaction, i) => (
            <span key={i} className="text-xs px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-700 font-medium animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              {reaction}
            </span>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">🎁 Special Halloween Perks!</h4>
          <div className="text-xs text-purple-800 space-y-1">
            <p>• Tag 3 friends for bonus transformation credits 👥</p>
            <p>• Share with #WaifuMaterialHalloween for featured showcase 🌟</p>
            <p>• Join our Discord for exclusive costume drops 💬</p>
            <p>• Get early access to winter holiday collection ❄️</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {userEmail && (
        <div className="text-center text-sm text-muted-foreground bg-purple-50 rounded-lg p-3">
          <p>✨ Your transformation will also be sent to: {userEmail}</p>
        </div>
      )}
    </div>
  );
};
