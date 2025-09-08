import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import sampleParisImg from "@/assets/Eiffel.jpeg";
import sampleNycImg from "@/assets/NY.jpeg";
// Updated assets

interface BackgroundUploadProps {
  onUpload: (file: File, url: string) => void;
}

export const BackgroundUpload = ({ onUpload }: BackgroundUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleSampleSelect = async (imageUrl: string, name: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `${name}.jpg`, { type: 'image/jpeg' });
      
      setPreview(imageUrl);
      setSelectedFile(file);
      toast.success(`${name} background selected!`);
    } catch (error) {
      toast.error("Failed to load sample background");
    }
  };

  const handleConfirmUpload = () => {
    if (!selectedFile) return;
    onUpload(selectedFile, preview!);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="font-display text-3xl font-bold mb-2 text-foreground">Choose Your Scene</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Select the perfect background scene where you want to place your group. 
          Think of it as choosing the location for your photo shoot.
        </p>
      </div>

      <div className="space-y-4">
        {/* Sample Backgrounds */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-medium text-lg mb-2">Or choose from sample backgrounds</h3>
            <p className="text-sm text-muted-foreground">Perfect scenes ready to use</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300 group overflow-hidden">
              <div 
                onClick={() => handleSampleSelect(sampleParisImg, "Paris")}
                className="relative"
              >
                <img
                  src={sampleParisImg}
                  alt="Paris with Eiffel Tower"
                  className="w-full h-32 object-contain bg-muted/20 rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3 text-center">
                  <h4 className="font-medium text-sm">Paris Scene</h4>
                  <p className="text-xs text-muted-foreground">Eiffel Tower backdrop</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Card>
            <Card className="cursor-pointer hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300 group overflow-hidden">
              <div 
                onClick={() => handleSampleSelect(sampleNycImg, "New York")}
                className="relative"
              >
                <img
                  src={sampleNycImg}
                  alt="New York with Statue of Liberty"
                  className="w-full h-32 object-contain bg-muted/20 rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3 text-center">
                  <h4 className="font-medium text-sm">New York Scene</h4>
                  <p className="text-xs text-muted-foreground">Statue of Liberty view</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Card>
          </div>
        </div>

          <Card
            className={`
              border-2 border-dashed transition-all duration-500 cursor-pointer hover-lift group relative overflow-hidden
              ${isDragOver
                ? "border-primary bg-gradient-accent shadow-glow scale-[1.02] animate-pulse-glow"
                : "border-border hover:border-primary/50 hover:shadow-card-hover hover:scale-[1.01]"
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            
            <div className="p-8 relative z-10">
              {preview ? (
                <div className="text-center space-y-4 animate-scale-in">
                  <img
                    src={preview}
                    alt="Background preview"
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-card transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <h3 className="font-semibold text-success">Background Selected ✓</h3>
                    <p className="text-sm text-muted-foreground">
                      Click to change or drag a new image
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow group-hover:scale-110 group-hover:shadow-[0_0_30px_hsl(var(--primary))] transition-all duration-300">
                    <Upload className="w-10 h-10 text-white group-hover:animate-bounce" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-display font-semibold text-xl group-hover:text-primary transition-colors duration-300">
                      Drop your background image here
                    </h3>
                    <p className="text-muted-foreground text-base">
                      or click to browse files
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
                        <span>JPG, PNG, GIF</span>
                      </span>
                      <span className="flex items-center space-x-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="w-1.5 h-1.5 bg-info rounded-full animate-pulse"></div>
                        <span>Up to 10MB</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </Card>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {preview && (
          <Button
            onClick={handleConfirmUpload}
            className="w-full bg-gradient-primary text-white shadow-elegant hover:shadow-glow hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
            size="lg"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            <ImageIcon className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            Continue with Background
          </Button>
        )}
      </div>
    </div>
  );
};
