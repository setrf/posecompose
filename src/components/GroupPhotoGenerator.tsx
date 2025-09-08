import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackgroundUpload } from "./BackgroundUpload";
import { PersonUpload } from "./PersonUpload";
import { PersonSelection } from "./PersonSelection";
import { ResultDisplay } from "./ResultDisplay";
import { StepIndicator } from "./StepIndicator";
import { LoadingSpinner } from "./LoadingSpinner";
import { AdvancedLoadingStates } from "./AdvancedLoadingStates";
import { exportFormats } from "./FormatSelection";
import { toast } from "sonner";

export interface Person {
  id: string;
  name: string;
  imageFile: File;
  imageUrl: string;
  processedImageUrl?: string;
  isProcessing?: boolean;
  skipBackgroundRemoval?: boolean;
}

export interface GenerationStep {
  current: 'background' | 'upload' | 'select' | 'generate' | 'result';
}

const GroupPhotoGenerator = () => {
  const [backgroundImage, setBackgroundImage] = useState<{ file: File; url: string } | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [peopleOrder, setPeopleOrder] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<GenerationStep['current']>('background');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  // API key is now handled server-side via a secure backend proxy
  const [poseDescription, setPoseDescription] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [selectedFormat, setSelectedFormat] = useState<string>('instagram-square');

  const handleBackgroundUpload = (file: File, url: string) => {
    setBackgroundImage({ file, url });
    setCurrentStep('upload');
    toast.success("Background uploaded successfully!");
  };

  const handlePersonAdd = async (person: Person) => {
    // Skip background removal for sample images
    if (person.skipBackgroundRemoval) {
      setPeople(prev => [...prev, person]);
      toast.success(`${person.name} added successfully!`);
      return;
    }

    // Add person with processing flag
    const personWithProcessing = { ...person, isProcessing: true };
    setPeople(prev => [...prev, personWithProcessing]);
    toast.success(`${person.name} added successfully! Processing background removal...`);

    try {
      // Remove background using Gemini (server-side proxy)
      const processedImageUrl = await removeBackgroundWithGemini(person.imageFile);
      
      // Update person with processed image
      setPeople(prev => prev.map(p => 
        p.id === person.id 
          ? { ...p, processedImageUrl, isProcessing: false }
          : p
      ));
      toast.success(`Background removed for ${person.name}!`);
    } catch (error) {
      console.error('Background removal failed:', error);
      // Update person to not processing but without processed image
      setPeople(prev => prev.map(p => 
        p.id === person.id 
          ? { ...p, isProcessing: false }
          : p
      ));
      toast.error(`Background removal failed for ${person.name}. Original image will be used.`);
    }
  };

  const handlePersonRemove = (id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id));
    setSelectedPeople(prev => prev.filter(pid => pid !== id));
  };

  const handleNextToSelection = () => {
    if (people.length === 0) {
      toast.error("Please add at least one person first!");
      return;
    }
    setCurrentStep('select');
  };

  const handleSelectionChange = (personIds: string[]) => {
    setSelectedPeople(personIds);
    // Update order to include new selections and remove deselected ones
    const newOrder = [...peopleOrder.filter(id => personIds.includes(id))];
    const newlySelected = personIds.filter(id => !peopleOrder.includes(id));
    setPeopleOrder([...newOrder, ...newlySelected]);
  };

  const handleGenerate = async () => {
    if (!backgroundImage) {
      toast.error("Please upload a background image!");
      return;
    }
    
    if (selectedPeople.length === 0) {
      toast.error("Please select at least one person!");
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generate');

    try {
      // Convert background to base64
      const backgroundBase64 = await fileToBase64(backgroundImage.file);
      
      // Get selected people in the correct order
      const orderedSelectedPeople = peopleOrder
        .filter(id => selectedPeople.includes(id))
        .map(id => people.find(p => p.id === id))
        .filter(Boolean) as Person[];

      // Get selected format details
      const format = exportFormats.find(f => f.id === selectedFormat) || exportFormats[0];
      
      // Stitch people together in the desired order with format dimensions
      const stitchedPeopleBase64 = await stitchPeopleImages(orderedSelectedPeople, format.aspectRatio);

      const response = await generateGroupPhoto(
        backgroundBase64,
        stitchedPeopleBase64,
        poseDescription,
        format
      );

      setGeneratedImage(response);
      setCurrentStep('result');
      toast.success("Group photo generated successfully!");
    } catch (error) {
      console.error('Generation error:', error);
      toast.error("Failed to generate group photo. Please try again.");
      setCurrentStep('select');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToBackground = () => {
    setCurrentStep('background');
  };

  const handleBackToUpload = () => {
    setCurrentStep('upload');
    setPeopleOrder([]);
  };

  const handleBackToSelection = () => {
    setCurrentStep('select');
  };

  const handleRetryBackgroundRemoval = async (personId: string) => {
    const person = people.find(p => p.id === personId);
    if (!person) return;

    // Set person as processing
    setPeople(prev => prev.map(p => 
      p.id === personId ? { ...p, isProcessing: true } : p
    ));

    try {
      // Remove background using Gemini
      const processedImageUrl = await removeBackgroundWithGemini(person.imageFile);
      
      // Update person with processed image
      setPeople(prev => prev.map(p => 
        p.id === personId 
          ? { ...p, processedImageUrl, isProcessing: false }
          : p
      ));
      toast.success(`Background removed for ${person.name}!`);
    } catch (error) {
      console.error('Background removal failed:', error);
      // Update person to not processing but without processed image
      setPeople(prev => prev.map(p => 
        p.id === personId 
          ? { ...p, isProcessing: false }
          : p
      ));
      toast.error(`Background removal failed for ${person.name}. Original image will be used.`);
    }
  };

  const handleStartOver = () => {
    setBackgroundImage(null);
    setPeople([]);
    setSelectedPeople([]);
    setCurrentStep('background');
    setGeneratedImage(null);
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
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-on-gradient mb-4 animate-fade-in">
              Pose Compose
            </h1>
            <p className="text-white/95 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed drop-shadow-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Compose the perfect group photo by combining individual photos with AI
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2 text-white/80 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium drop-shadow-sm">Powered by Google Gemini AI</span>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <StepIndicator currentStep={currentStep} />
          </div>

          <div className="max-w-6xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Card className="p-8 md:p-12 shadow-elegant card-on-gradient hover-lift animate-scale-in">
              {currentStep === 'background' && (
                <div className="animate-fade-in">
                  <BackgroundUpload
                    onUpload={handleBackgroundUpload}
                  />
                </div>
              )}

              {currentStep === 'upload' && (
                <div className="animate-fade-in">
                  <PersonUpload
                    people={people}
                    onPersonAdd={handlePersonAdd}
                    onPersonRemove={handlePersonRemove}
                    onNext={handleNextToSelection}
                    onBack={handleBackToBackground}
                    backgroundImage={backgroundImage}
                  />
                </div>
              )}

              {currentStep === 'select' && (
                <div className="animate-fade-in">
                  <PersonSelection
                    people={people}
                    selectedPeople={selectedPeople}
                    onSelectionChange={handleSelectionChange}
                    onGenerate={handleGenerate}
                    onBack={handleBackToUpload}
                    backgroundImage={backgroundImage}
                    onRetryBackgroundRemoval={handleRetryBackgroundRemoval}
                    poseDescription={poseDescription}
                    onPoseDescriptionChange={setPoseDescription}
                    peopleOrder={peopleOrder}
                    onPeopleOrderChange={setPeopleOrder}
                    aspectRatio={aspectRatio}
                    onAspectRatioChange={setAspectRatio}
                    selectedFormat={selectedFormat}
                    onFormatChange={setSelectedFormat}
                  />
                </div>
              )}

              {currentStep === 'generate' && (
                <AdvancedLoadingStates />
              )}

              {currentStep === 'result' && generatedImage && (
                <div className="animate-fade-in">
                  <ResultDisplay
                    generatedImage={generatedImage}
                    onStartOver={handleStartOver}
                    onBackToSelection={handleBackToSelection}
                    selectedPeople={people.filter(p => selectedPeople.includes(p.id))}
                    backgroundImage={backgroundImage}
                  />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
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

// Helper function to convert data URL to base64
const urlToBase64 = (dataUrl: string): Promise<string> => {
  return Promise.resolve(dataUrl.split(',')[1]);
};

// Function to remove background using Gemini via backend proxy
const removeBackgroundWithGemini = async (imageFile: File): Promise<string> => {
  const base64Image = await fileToBase64(imageFile);
  
  const prompt = `Remove the background from this image completely. Return only the person/subject with a transparent background. Make sure to:
- Keep all details of the person intact
- Remove all background elements completely
- Create clean edges around the person
- Maintain the person's original proportions and quality
- Return the image with a transparent background`;

  const response = await fetch(`/api/gemini/generate-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }],
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.1,
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Background removal API request failed: ${error}`);
  }

  const data = await response.json();
  
  // Look for image data in different parts of the response
  const candidate = data.candidates?.[0];
  if (!candidate?.content?.parts) {
    throw new Error('No content parts in background removal response');
  }

  // Find the part with image data
  let imageData = null;
  for (const part of candidate.content.parts) {
    if (part.inlineData?.data) {
      imageData = part.inlineData.data;
      break;
    }
  }

  if (!imageData) {
    console.error('Background removal response structure:', JSON.stringify(data, null, 2));
    throw new Error('No image data found in background removal response');
  }

  return `data:image/png;base64,${imageData}`;
};

// Function to stitch people images together in order with proper aspect ratio
const stitchPeopleImages = async (people: Person[], aspectRatio: string = '16:9'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Parse aspect ratio
    const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
    const targetAspectRatio = widthRatio / heightRatio;

    // Load all images first
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    Promise.all(
      people.map(async (person) => {
        const imageUrl = person.processedImageUrl || person.imageUrl;
        return loadImage(imageUrl);
      })
    ).then((images) => {
      // Calculate dimensions for people strip
      const maxHeight = Math.max(...images.map(img => img.height));
      const totalWidth = images.reduce((sum, img) => sum + img.width, 0);
      
      // Create temporary canvas for people strip
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) {
        reject(new Error('Could not get temp canvas context'));
        return;
      }
      
      tempCanvas.width = totalWidth;
      tempCanvas.height = maxHeight;
      
      // Draw each image side by side on temp canvas
      let currentX = 0;
      images.forEach((img) => {
        // Center vertically if image is shorter than maxHeight
        const y = (maxHeight - img.height) / 2;
        tempCtx.drawImage(img, currentX, y);
        currentX += img.width;
      });
      
      // Calculate final canvas dimensions based on aspect ratio
      // Use a reasonable base size and scale to fit aspect ratio
      const baseWidth = 1200;
      const targetHeight = baseWidth / targetAspectRatio;
      
      canvas.width = baseWidth;
      canvas.height = targetHeight;
      
      // Fill with solid white background to ensure JPEG encoding (no alpha)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate how to fit the people strip into the aspect ratio canvas
      const peopleAspectRatio = totalWidth / maxHeight;
      let drawWidth, drawHeight, drawX, drawY;
      
      if (peopleAspectRatio > targetAspectRatio) {
        // People strip is wider than target - fit by width
        drawWidth = canvas.width * 0.8; // Leave some margin
        drawHeight = drawWidth / peopleAspectRatio;
        drawX = canvas.width * 0.1;
        drawY = (canvas.height - drawHeight) / 2;
      } else {
        // People strip is taller than target - fit by height
        drawHeight = canvas.height * 0.8; // Leave some margin
        drawWidth = drawHeight * peopleAspectRatio;
        drawX = (canvas.width - drawWidth) / 2;
        drawY = canvas.height * 0.1;
      }
      
      // Draw the people strip centered on the final canvas
      ctx.drawImage(tempCanvas, drawX, drawY, drawWidth, drawHeight);
      
      // Convert to base64 JPEG to improve compatibility with upstream API
      const base64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
      resolve(base64);
    }).catch(reject);
  });
};

const generateGroupPhoto = async (
  backgroundBase64: string,
  stitchedPeopleBase64: string,
  poseDescription?: string,
  format?: { id: string; name: string; dimensions: { width: number; height: number }; aspectRatio: string }
): Promise<string> => {
  const poseInstructions = poseDescription 
    ? `\n\nPOSE REQUIREMENTS:\n- ${poseDescription}\n- Blend the people naturally into the scene according to this pose description`
    : '';
  
  const formatInstructions = format 
    ? `\n\nFORMAT: Generate the image in ${format.aspectRatio} aspect ratio format (${format.dimensions.width}x${format.dimensions.height}px) optimized for ${format.name}.`
    : '';
  
  const prompt = `Create a realistic group photo by seamlessly blending the people from the second image into the background scene from the first image.

REQUIREMENTS:
- Place all the people naturally in the background scene as if they were actually there when the photo was taken
- Match the lighting, shadows, and perspective of the background for all people
- Make it look like an authentic group photograph taken in this location
- Blend the images seamlessly so there are no obvious compositing artifacts
- Maintain the relative positions and arrangement of the people as shown in the second image

CRITICAL SIZE & PROPORTION REQUIREMENTS:
- Pay extra careful attention to the size and scale of each person in relation to people and objects around them in the background
- Ensure all subjects have realistic proportions that match the depth and perspective of the background scene
- People in the foreground should be larger, people in the background should be smaller according to realistic perspective
- Match the scale of people to existing objects, furniture, architecture, or other reference points in the background

CRITICAL LIGHTING & COLOR REQUIREMENTS:
- Seamlessly blend lighting conditions - match the direction, intensity, and color temperature of light sources in the background
- Generate realistic shadows that match the background's lighting direction and intensity
- Adjust skin tones and clothing colors to match the ambient lighting and color palette of the background scene
- Ensure edge lighting and rim lighting on people matches the background environment
- Color grade all people to have the same photographic characteristics as the background (saturation, contrast, warmth)${poseInstructions}${formatInstructions}

Generate a single composite image showing all people together in the background scene.`;

  const images = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: backgroundBase64
      }
    },
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: stitchedPeopleBase64
      }
    }
  ];

  const response = await fetch(`/api/gemini/generate-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          ...images
        ]
      }],
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.2,
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Group photo generation API request failed: ${error}`);
  }

  const data = await response.json();
  
  // Look for image data in different parts of the response
  const candidate = data.candidates?.[0];
  if (!candidate?.content?.parts) {
    throw new Error('No content parts in generation response');
  }

  // Find the part with image data
  let imageData = null;
  for (const part of candidate.content.parts) {
    if (part.inlineData?.data) {
      imageData = part.inlineData.data;
      break;
    }
  }

  if (!imageData) {
    console.error('Generation response structure:', JSON.stringify(data, null, 2));
    throw new Error('No image data found in generation response');
  }

  return `data:image/png;base64,${imageData}`;
};

export default GroupPhotoGenerator;
