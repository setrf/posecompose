import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { exportFormats, type ExportFormat } from "@/constants/export-formats";

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