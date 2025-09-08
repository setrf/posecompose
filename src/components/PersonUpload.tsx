import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, User, X, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { Person } from "./GroupPhotoGenerator";
import { ImageCropper } from "./ImageCropper";

// Import sample images
import ireneNyc from "@/assets/Irene_at_NYC.jpeg";
import joshParis from "@/assets/Josh_at_Paris.jpeg";
import kristinParis from "@/assets/Kristin_at_Paris.jpeg";
import mikeNyc from "@/assets/Mike_at_NYC.jpeg";
import susanParis from "@/assets/Susan_at_Paris.jpeg";
import zainabNyc from "@/assets/Zainab_at_NYC.jpeg";

interface PersonUploadProps {
  people: Person[];
  onPersonAdd: (person: Person) => void;
  onPersonRemove: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  backgroundImage: { file: File; url: string } | null;
}

export const PersonUpload = ({
  people,
  onPersonAdd,
  onPersonRemove,
  onNext,
  onBack,
  backgroundImage,
}: PersonUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
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
    
    // Auto-fill name with filename (without extension) if name field is empty
    if (!currentName.trim()) {
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      setCurrentName(nameWithoutExtension);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleAddPerson = () => {
    if (!selectedFile || !currentName.trim()) {
      toast.error("Please provide both a name and photo");
      return;
    }

    if (people.some(p => p.name.toLowerCase() === currentName.toLowerCase())) {
      toast.error("A person with this name already exists");
      return;
    }

    // Show cropper instead of immediately adding
    setShowCropper(true);
  };

  const handleCropComplete = (croppedFile: File) => {
    const croppedUrl = URL.createObjectURL(croppedFile);
    
    const person: Person = {
      id: crypto.randomUUID(),
      name: currentName.trim(),
      imageFile: croppedFile,
      imageUrl: croppedUrl,
    };

    onPersonAdd(person);
    
    // Reset form
    setCurrentName("");
    setSelectedFile(null);
    setPreview(null);
    setShowCropper(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    toast.success(`${person.name} added successfully!`);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
  };

  const samplePeople = [
    { name: "Irene at NYC", image: ireneNyc },
    { name: "Josh at Paris", image: joshParis },
    { name: "Kristin at Paris", image: kristinParis },
    { name: "Mike at NYC", image: mikeNyc },
    { name: "Susan at Paris", image: susanParis },
    { name: "Zainab at NYC", image: zainabNyc },
  ];

  const handleSamplePersonSelect = async (samplePerson: { name: string; image: string }) => {
    if (people.some(p => p.name.toLowerCase() === samplePerson.name.toLowerCase())) {
      toast.error("A person with this name already exists");
      return;
    }

    try {
      const response = await fetch(samplePerson.image);
      const blob = await response.blob();
      const file = new File([blob], `${samplePerson.name}.jpg`, { type: 'image/jpeg' });
      
      // Set up the cropping flow for sample images too
      setCurrentName(samplePerson.name);
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setShowCropper(true);
    } catch (error) {
      toast.error("Failed to load sample person");
    }
  };

  if (showCropper && selectedFile && preview) {
    return (
      <div className="space-y-6">
        <ImageCropper
          imageUrl={preview}
          personName={currentName}
          onCrop={handleCropComplete}
          onCancel={handleCropCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="font-display text-3xl font-bold mb-2 text-foreground">Add Your People</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Upload individual photos of people you want to include. 
          Each person will be cropped and prepared for the group photo.
        </p>
      </div>

      {backgroundImage && (
        <Card className="p-6 glass-effect border border-success/20 bg-success-muted/10 hover-lift relative overflow-hidden group animate-fade-in">
          {/* Success pulse animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-success/5 to-transparent animate-pulse" />
          <div className="flex items-center space-x-4 relative z-10">
            <div className="relative group-hover:scale-105 transition-transform duration-300">
              <img
                src={backgroundImage.url}
                alt="Selected background"
                className="w-20 h-20 rounded-xl object-cover shadow-card"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-pulse">
                <span className="text-success-foreground text-xs">✓</span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-semibold text-lg">Scene Selected</h3>
              <p className="text-sm text-muted-foreground">
                Perfect! Now let's add people to this beautiful scene
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Sample People */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-medium text-lg mb-2">Or choose from sample people</h3>
          <p className="text-sm text-muted-foreground">Quick start with professional portraits</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {samplePeople.map((person, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300 group overflow-hidden">
              <div 
                onClick={() => handleSamplePersonSelect(person)}
                className="relative"
              >
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-24 object-contain bg-muted/20 rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-2 text-center">
                  <h4 className="font-medium text-xs truncate">{person.name}</h4>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Form */}
        <div className="space-y-4">
          <h3 className="font-semibold">Add New Person</h3>
          
          <Input
            placeholder="Enter person's name"
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 hover:border-primary/30"
          />

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
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            
            <div className="p-6 relative z-10">
              {preview ? (
                <div className="text-center space-y-3 animate-scale-in">
                  <img
                    src={preview}
                    alt="Person preview"
                    className="w-32 h-32 mx-auto rounded-lg object-contain shadow-card bg-muted/30 transition-transform duration-300 group-hover:scale-105"
                  />
                  <p className="text-sm text-muted-foreground">
                    Click to change photo
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow group-hover:scale-110 group-hover:shadow-[0_0_25px_hsl(var(--primary))] transition-all duration-300">
                    <User className="w-8 h-8 text-white group-hover:animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-display font-medium text-lg group-hover:text-primary transition-colors duration-300">Add Person Photo</p>
                    <p className="text-sm text-muted-foreground">
                      Drop image here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground opacity-70">
                      Best results with clear, well-lit photos
                    </p>
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

          <Button
            onClick={handleAddPerson}
            disabled={!selectedFile || !currentName.trim()}
            className="w-full bg-gradient-primary text-white hover:shadow-glow hover:scale-[1.02] transition-all duration-300 disabled:hover:scale-100 disabled:hover:shadow-none relative overflow-hidden group"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            <span className="relative z-10">Add Person</span>
          </Button>
        </div>

        {/* People List */}
        <div className="space-y-4">
          <h3 className="font-semibold">
            Added People ({people.length})
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {people.length === 0 ? (
              <Card className="p-6 text-center">
                <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No people added yet
                </p>
              </Card>
            ) : (
              people.map((person, index) => (
                <Card key={person.id} className="p-3 hover-lift hover:shadow-card-hover transition-all duration-300 animate-fade-in group" style={{ animationDelay: `${index * 0.05}s` }}>
                     <div className="flex items-center space-x-3">
                      <div className="relative group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={person.imageUrl}
                          alt={person.name}
                          className="w-12 h-12 rounded-lg object-contain shadow-sm bg-muted/30"
                        />
                        {person.isProcessing && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{person.name}</p>
                        {person.isProcessing && (
                          <p className="text-xs text-muted-foreground">Processing background removal...</p>
                        )}
                        {person.processedImageUrl && (
                          <p className="text-xs text-green-600 animate-fade-in">✓ Background removed</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPersonRemove(person.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:scale-110 transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Background
        </Button>
        {people.length > 0 && (
          <Button
            onClick={onNext}
            className="flex-1 bg-gradient-primary text-white shadow-elegant hover:shadow-glow hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
            size="lg"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            <span className="relative z-10 flex items-center">
              Continue to Selection
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};