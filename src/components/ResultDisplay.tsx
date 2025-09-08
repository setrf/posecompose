import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { Person } from "./GroupPhotoGenerator";

interface ResultDisplayProps {
  generatedImage: string;
  onStartOver: () => void;
  onBackToSelection: () => void;
  selectedPeople: Person[];
  backgroundImage: { file: File; url: string } | null;
}

export const ResultDisplay = ({
  generatedImage,
  onStartOver,
  onBackToSelection,
  selectedPeople,
  backgroundImage,
}: ResultDisplayProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `group-photo-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };



  return (
    <div className="space-y-6">
      <div className="text-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-2 gradient-text">🎉 Your Group Photo is Ready!</h2>
        <p className="text-muted-foreground text-lg">
          AI has successfully combined your photos into a realistic group shot
        </p>
      </div>

      {/* Generated Image */}
      <Card className="p-4 hover-lift transition-all duration-300 animate-scale-in">
        <div className="text-center space-y-4">
          <img
            src={generatedImage}
            alt="Generated group photo"
            className="max-w-full max-h-96 mx-auto rounded-lg shadow-elegant hover:shadow-glow hover:scale-[1.02] transition-all duration-500 cursor-pointer"
            onClick={() => window.open(generatedImage, '_blank')}
          />
          <div className="flex flex-wrap justify-center gap-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-gradient-primary text-white hover:shadow-glow hover:scale-[1.05] transition-all duration-300 relative overflow-hidden group"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 flex items-center">
                <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                {isDownloading ? "Downloading..." : "Download"}
              </span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Photo Details */}
      <Card className="p-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h3 className="font-semibold mb-3">Photo Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">People Included</h4>
            <div className="flex flex-wrap gap-2">
              {selectedPeople.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center space-x-2 bg-gradient-accent rounded-lg px-3 py-1"
                >
                  <img
                    src={person.imageUrl}
                    alt={person.name}
                    className="w-6 h-6 rounded-full object-contain bg-muted/30"
                  />
                  <span className="text-sm font-medium">{person.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {backgroundImage && (
            <div>
              <h4 className="font-medium mb-2">Background Scene</h4>
              <div className="flex items-center space-x-2">
                <img
                  src={backgroundImage.url}
                  alt="Background"
                  className="w-16 h-12 rounded object-cover"
                />
                <span className="text-sm text-muted-foreground">
                  Original background combined with {selectedPeople.length} people
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <Button
          onClick={onBackToSelection}
          variant="outline"
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Selection
        </Button>
        <Button
          onClick={onStartOver}
          variant="outline"
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Create Another Photo
        </Button>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 bg-gradient-primary text-white shadow-elegant hover:shadow-glow hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          <span className="relative z-10 flex items-center">
            <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            {isDownloading ? "Downloading..." : "Download High Quality"}
          </span>
        </Button>
      </div>

      {/* Tips */}
      <Card className="p-4 bg-gradient-secondary animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <h4 className="font-medium mb-2">💡 Tips for Better Results</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Use high-quality photos with good lighting</li>
          <li>• Choose backgrounds with enough space for multiple people</li>
          <li>• Individual photos work best when people are facing forward</li>
          <li>• Try different combinations of people for varied results</li>
        </ul>
      </Card>
    </div>
  );
};