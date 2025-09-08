import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Smartphone,
  Monitor
} from "lucide-react";

export interface ExportFormat {
  id: string;
  name: string;
  dimensions: { width: number; height: number };
  description: string;
  aspectRatio: string;
  icon: React.ReactNode;
  color: string;
}

export const exportFormats: ExportFormat[] = [
  {
    id: 'instagram-square',
    name: 'Instagram Post',
    dimensions: { width: 1080, height: 1080 },
    description: 'Perfect square for Instagram feed',
    aspectRatio: '1:1',
    icon: <Instagram className="w-4 h-4" />,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500'
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    dimensions: { width: 1080, height: 1920 },
    description: 'Vertical format for stories',
    aspectRatio: '9:16',
    icon: <Smartphone className="w-4 h-4" />,
    color: 'bg-gradient-to-r from-orange-400 to-pink-500'
  },
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    dimensions: { width: 1200, height: 630 },
    description: 'Optimized for Facebook timeline',
    aspectRatio: '1.91:1',
    icon: <Facebook className="w-4 h-4" />,
    color: 'bg-[#4267B2]'
  },
  {
    id: 'twitter-post',
    name: 'Twitter Post',
    dimensions: { width: 1200, height: 675 },
    description: 'Perfect for Twitter sharing',
    aspectRatio: '16:9',
    icon: <Twitter className="w-4 h-4" />,
    color: 'bg-[#1DA1F2]'
  },
  {
    id: 'desktop-wallpaper',
    name: 'Desktop Wallpaper',
    dimensions: { width: 1920, height: 1080 },
    description: 'Full HD desktop background',
    aspectRatio: '16:9',
    icon: <Monitor className="w-4 h-4" />,
    color: 'bg-gradient-to-r from-blue-500 to-purple-600'
  },
  {
    id: 'mobile-wallpaper',
    name: 'Mobile Wallpaper',
    dimensions: { width: 1080, height: 2340 },
    description: 'Modern smartphone wallpaper',
    aspectRatio: '9:19.5',
    icon: <Smartphone className="w-4 h-4" />,
    color: 'bg-gradient-to-r from-green-500 to-blue-500'
  }
];

interface FormatSelectionProps {
  selectedFormat: string;
  onFormatChange: (formatId: string) => void;
}

export const FormatSelection = ({ selectedFormat, onFormatChange }: FormatSelectionProps) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">Output Format</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Choose the perfect format for your intended use
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {exportFormats.map((format) => (
            <div
              key={format.id}
              className={`
                p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover-lift
                ${selectedFormat === format.id
                  ? "ring-2 ring-primary bg-gradient-accent shadow-elegant border-primary"
                  : "hover:shadow-card-hover hover:border-primary/30 border-border"
                }
              `}
              onClick={() => onFormatChange(format.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg text-white ${format.color}`}>
                    {format.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{format.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {format.dimensions.width} × {format.dimensions.height}px
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {format.aspectRatio}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {format.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};