import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Mail, Gift, Sparkles, Shield } from 'lucide-react';
import { CostumePreset } from '@/types/costume';
import { logEvent } from '@/lib/logger';
import { toast } from 'sonner';

interface EmailCaptureProps {
  selectedCostume: CostumePreset;
  onEmailSubmit: (email: string, marketingConsent: boolean) => void;
  onSkip: () => void;
}

export const EmailCapture = ({ selectedCostume, onEmailSubmit, onSkip }: EmailCaptureProps) => {
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      logEvent('email_capture_submitted', {
        costumeId: selectedCostume.id,
        costumeName: selectedCostume.name,
        marketingConsent
      });

      // Validate email
      if (!email || !email.includes('@')) {
        toast.error('Please enter a valid email address');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      onEmailSubmit(email, marketingConsent);
      
      if (marketingConsent) {
        logEvent('marketing_consent_given', {
          costumeId: selectedCostume.id,
          costumeName: selectedCostume.name
        });
        toast.success('Welcome to the Waifu Material newsletter! 🎃');
      } else {
        toast.success('Email saved! Your transformation will begin shortly.');
      }
    } catch (error) {
      logEvent('email_capture_failed', {
        costumeId: selectedCostume.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    logEvent('email_capture_skipped', {
      costumeId: selectedCostume.id,
      costumeName: selectedCostume.name
    });
    onSkip();
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold gradient-text">
            🎃 Your {selectedCostume.name} Magic Awaits!
          </h2>
          <p className="text-muted-foreground">
            Join 10,000+ magical transformations this Halloween season ✨
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Gift className="w-3 h-3" />
            Free transformations
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI-powered
          </Badge>
        </div>
      </div>

      {/* Benefits */}
      <Card className="p-6 space-y-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <h3 className="font-semibold text-purple-900">🎁 Why Join Waifu Material?</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-purple-800">🎃 Weekly Halloween costume drops & exclusives</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-pink-600" />
            </div>
            <span className="text-purple-800">✨ Early access to seasonal transformations</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-purple-800">💜 Free AI transformation credits every month</span>
          </div>
        </div>
      </Card>

      {/* Email Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full"
              required
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="marketing"
              checked={marketingConsent}
              onCheckedChange={(checked) => setMarketingConsent(checked)}
              className="mt-1"
            />
            <label htmlFor="marketing" className="text-sm text-muted-foreground leading-relaxed">
              Yes, send me updates about new costumes, special offers, and AI transformation tips. 
              You can unsubscribe anytime.
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isSubmitting ? 'Joining...' : 'Transform Me!'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
            >
              Skip
            </Button>
          </div>
        </form>
      </Card>

      {/* Affiliate Disclosure */}
      <div className="space-y-3 text-xs text-muted-foreground">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <h4 className="font-semibold text-amber-900 mb-2">💝 Affiliate Disclosure</h4>
          <p className="text-amber-800 leading-relaxed">
            Waifu Material contains affiliate links. When you purchase costumes through our partner links, 
            we may earn a small commission at no additional cost to you. This helps us keep the transformation 
            service free for everyone.
          </p>
          <p className="text-amber-800 mt-2">
            We only recommend costume partners that meet our quality standards and enhance your transformation experience.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-semibold text-blue-900 mb-2">🛡️ Privacy Promise</h4>
          <p className="text-blue-800 leading-relaxed">
            Your email is safe with us. We never sell your data to third parties, and you can unsubscribe 
            with one click. We hate spam as much as you do.
          </p>
        </div>
      </div>

      {/* Social Proof */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Join 10,000+ magical transformations this Halloween 🎃
        </p>
        <div className="flex justify-center gap-2">
          {['Amazing!', 'So cool!', 'Love it!'].map((review, i) => (
            <span key={i} className="text-xs px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-700">
              "{review}"
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
