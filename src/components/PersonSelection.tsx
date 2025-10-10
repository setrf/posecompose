import type { CSSProperties } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, ArrowLeft, RefreshCw, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { FormatSelection } from "./FormatSelection";
import type { Person } from "./GroupPhotoGenerator";

interface PersonSelectionProps {
  people: Person[];
  selectedPeople: string[];
  onSelectionChange: (personIds: string[]) => void;
  onGenerate: () => void;
  onBack: () => void;
  backgroundImage: { file: File; url: string } | null;
  onRetryBackgroundRemoval: (personId: string) => void;
  poseDescription: string;
  onPoseDescriptionChange: (description: string) => void;  
  peopleOrder: string[];
  onPeopleOrderChange: (order: string[]) => void;
  aspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  selectedFormat: string;
  onFormatChange: (formatId: string) => void;
}

export const PersonSelection = ({
  people,
  selectedPeople,
  onSelectionChange,
  onGenerate,
  onBack,
  backgroundImage,
  onRetryBackgroundRemoval,
  poseDescription,
  onPoseDescriptionChange,
  peopleOrder,
  onPeopleOrderChange,
  aspectRatio,
  onAspectRatioChange,
  selectedFormat,
  onFormatChange,
}: PersonSelectionProps) => {
  const handlePersonToggle = (personId: string) => {
    const newSelection = selectedPeople.includes(personId)
      ? selectedPeople.filter(id => id !== personId)
      : [...selectedPeople, personId];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const allIds = people.map(p => p.id);
    onSelectionChange(selectedPeople.length === people.length ? [] : allIds);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(peopleOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onPeopleOrderChange(items);
  };

  const movePersonUp = (personId: string) => {
    const currentIndex = peopleOrder.indexOf(personId);
    if (currentIndex > 0) {
      const newOrder = [...peopleOrder];
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
      onPeopleOrderChange(newOrder);
    }
  };

  const movePersonDown = (personId: string) => {
    const currentIndex = peopleOrder.indexOf(personId);
    if (currentIndex < peopleOrder.length - 1) {
      const newOrder = [...peopleOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
      onPeopleOrderChange(newOrder);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="font-display text-3xl font-bold mb-2 text-foreground">Compose Your Group</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Select and arrange the people for your group photo. 
          You can reorder them and even describe the pose you want.
        </p>
      </div>

      {backgroundImage && (
        <Card className="p-6 glass-effect border border-primary/20 bg-primary-muted/20 hover-lift">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={backgroundImage.url}
                alt="Selected background"
                className="w-20 h-20 rounded-xl object-cover shadow-card"
              />
              <div className="absolute -bottom-2 -right-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full font-medium shadow-sm">
                {selectedPeople.length}/{people.length}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-semibold text-lg">Your Scene</h3>
              <p className="text-sm text-muted-foreground">
                {selectedPeople.length === 0 ? 'Select people to add to this scene' : 
                 selectedPeople.length === 1 ? '1 person selected' :
                 `${selectedPeople.length} people selected`}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          Select People ({selectedPeople.length}/{people.length})
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
        >
          {selectedPeople.length === people.length ? "Deselect All" : "Select All"}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {people.map((person, index) => {
          const isSelected = selectedPeople.includes(person.id);
          return (
            <Card
              key={person.id}
              className={`
                p-4 cursor-pointer transition-all duration-300 hover-lift group relative overflow-hidden animate-fade-in
                ${isSelected
                  ? "ring-2 ring-primary bg-gradient-accent shadow-elegant scale-[1.02] animate-pulse-glow"
                  : "hover:shadow-card-hover hover:scale-[1.01] hover:ring-1 hover:ring-primary/30"
                }
              `}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handlePersonToggle(person.id)}
            >
              {/* Selection glow effect */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-pulse" />
              )}
              
              <div className="space-y-3 relative z-10">
                 <div className="relative group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={person.processedImageUrl || person.imageUrl}
                      alt={person.name}
                      className="w-full aspect-square rounded-lg object-contain shadow-sm bg-muted/30"
                    />
                   <div className="absolute top-2 right-2">
                     <Checkbox
                       checked={isSelected}
                       onChange={() => {}} // Handled by card click
                       className={`bg-white shadow-sm transition-all duration-300 ${isSelected ? 'scale-110' : ''}`}
                     />
                   </div>
                     {person.processedImageUrl && (
                       <div className="absolute bottom-2 left-2 flex gap-1">
                         <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full animate-fade-in">
                           ✓ Background Removed
                         </div>
                         <Button
                           size="sm"
                           variant="secondary"
                           className="h-6 px-2 text-xs hover:scale-110 transition-transform duration-300"
                           onClick={(e) => {
                             e.stopPropagation();
                             onRetryBackgroundRemoval(person.id);
                           }}
                         >
                           <RefreshCw className="w-3 h-3" />
                         </Button>
                       </div>
                     )}
                    {!person.isProcessing && !person.processedImageUrl && (
                      <div className="absolute bottom-2 left-2">
                         <Button
                           size="sm"
                           variant="secondary"
                           className="h-6 px-2 text-xs hover:scale-110 transition-transform duration-300"
                           onClick={(e) => {
                             e.stopPropagation();
                             onRetryBackgroundRemoval(person.id);
                           }}
                         >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Retry
                        </Button>
                      </div>
                    )}
                    {person.isProcessing && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                      </div>
                    )}
                 </div>
                <div className="text-center">
                  <h4 className="font-medium">{person.name}</h4>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedPeople.length === 0 && (
        <Card className="p-6 text-center bg-gradient-secondary">
          <p className="text-muted-foreground">
            Select at least one person to generate your group photo
          </p>
        </Card>
      )}

      {selectedPeople.length > 0 && (
        <div className="space-y-4">
          <Card className="p-4 bg-gradient-accent">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Preview</h4>
              <p className="text-sm text-muted-foreground">
                Creating a group photo with{" "}
                <span className="font-medium text-foreground">
                  {peopleOrder
                    .filter(id => selectedPeople.includes(id))
                    .map(id => people.find(p => p.id === id)?.name)
                    .join(", ")}
                </span>{" "}
                in the selected background scene
              </p>
            </div>
          </Card>

          {selectedPeople.length > 1 && (
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Arrange people order (left to right)</Label>
                  <p className="text-xs text-muted-foreground">Drag to reorder</p>
                </div>
                
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="people-order">
                    {(provided, snapshot) => (
                      <div 
                        {...provided.droppableProps} 
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {peopleOrder
                          .filter(id => selectedPeople.includes(id))
                          .map((personId, index) => {
                            const person = people.find(p => p.id === personId);
                            if (!person) return null;
                            
                            return (
                                <Draggable key={personId} draggableId={personId} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`flex items-center gap-3 p-3 rounded-lg border bg-card ${
                                        snapshot.isDragging 
                                          ? 'shadow-lg border-primary opacity-90' 
                                          : 'hover:bg-gradient-secondary border-border'
                                      }`}
                                      style={(() => {
                                        const baseStyle = (provided.draggableProps.style ?? {}) as CSSProperties;
                                        if (!snapshot.isDragging) {
                                          return baseStyle;
                                        }

                                        return {
                                          ...baseStyle,
                                          left: "auto",
                                          top: "auto",
                                        };
                                      })()}
                                    >
                                      <div 
                                        {...provided.dragHandleProps} 
                                        className="flex items-center justify-center w-6 h-6 text-muted-foreground hover:text-primary cursor-grab active:cursor-grabbing"
                                      >
                                        <GripVertical className="w-4 h-4" />
                                      </div>
                                    
                                     <img
                                       src={person.processedImageUrl || person.imageUrl}
                                       alt={person.name}
                                       className="w-10 h-10 rounded-lg object-contain bg-muted/30"
                                     />
                                    
                                    <div className="flex-1">
                                      <p className="font-medium">{person.name}</p>
                                      <p className="text-xs text-muted-foreground">Position {index + 1}</p>
                                    </div>
                                    
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0"
                                        onClick={() => movePersonUp(personId)}
                                        disabled={index === 0}
                                      >
                                        <ChevronUp className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0"
                                        onClick={() => movePersonDown(personId)}
                                        disabled={index === peopleOrder.filter(id => selectedPeople.includes(id)).length - 1}
                                      >
                                        <ChevronDown className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </Card>
          )}

          <FormatSelection
            selectedFormat={selectedFormat}
            onFormatChange={onFormatChange}
          />

          <Card className="p-4">
            <div className="space-y-3">
              <Label htmlFor="pose-description">Describe the desired pose (optional)</Label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  "Everyone jumping in the air with excitement",
                  "Standing in a line with arms around each other",
                  "Making funny faces and silly poses",
                  "Sitting casually like old friends",
                  "Forming a heart shape with their hands",
                  "Standing in height order",
                  "Sitting on steps like a graduation photo",
                  "Dancing or celebrating together"
                ].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2"
                    onClick={() => onPoseDescriptionChange(preset)}
                  >
                    {preset}
                  </Button>
                ))}
              </div>
              
              <Textarea
                id="pose-description"
                placeholder="Or describe your own custom pose idea..."
                value={poseDescription}
                onChange={(e) => onPoseDescriptionChange(e.target.value)}
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">
                Click a preset above or describe how you'd like the people positioned in the final photo
              </p>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Upload
            </Button>
            <Button
              onClick={onGenerate}
              className="flex-1 bg-gradient-primary text-white shadow-elegant hover:shadow-glow hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
              size="lg"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                Generate Group Photo
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};