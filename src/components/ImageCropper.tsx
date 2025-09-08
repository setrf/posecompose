import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crop, RotateCcw, Check, X, Grid3X3 } from "lucide-react";

interface ImageCropperProps {
  imageUrl: string;
  onCrop: (croppedImageFile: File) => void;
  onCancel: () => void;
  personName: string;
}

export const ImageCropper = ({ imageUrl, onCrop, onCancel, personName }: ImageCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cropRect, setCropRect] = useState({ x: 50, y: 50, width: 200, height: 200 });
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const maxWidth = 600;
        const maxHeight = 400;
        
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const ratio = Math.min(widthRatio, heightRatio);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        setScale(width / img.naturalWidth);
        
        // Set initial crop to center
        const initialSize = Math.min(width, height) * 0.6;
        setCropRect({
          x: (width - initialSize) / 2,
          y: (height - initialSize) / 2,
          width: initialSize,
          height: initialSize
        });
      }
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Draw crop overlay
    if (cropRect.width > 0 && cropRect.height > 0) {
      // Darken areas outside crop
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      
      // Top
      ctx.fillRect(0, 0, canvas.width, cropRect.y);
      // Bottom
      ctx.fillRect(0, cropRect.y + cropRect.height, canvas.width, canvas.height - cropRect.y - cropRect.height);
      // Left
      ctx.fillRect(0, cropRect.y, cropRect.x, cropRect.height);
      // Right
      ctx.fillRect(cropRect.x + cropRect.width, cropRect.y, canvas.width - cropRect.x - cropRect.width, cropRect.height);
      
      // Draw crop border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
      
      // Draw grid lines if enabled
      if (showGrid) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        const thirdWidth = cropRect.width / 3;
        ctx.beginPath();
        ctx.moveTo(cropRect.x + thirdWidth, cropRect.y);
        ctx.lineTo(cropRect.x + thirdWidth, cropRect.y + cropRect.height);
        ctx.moveTo(cropRect.x + thirdWidth * 2, cropRect.y);
        ctx.lineTo(cropRect.x + thirdWidth * 2, cropRect.y + cropRect.height);
        ctx.stroke();
        
        // Horizontal lines
        const thirdHeight = cropRect.height / 3;
        ctx.beginPath();
        ctx.moveTo(cropRect.x, cropRect.y + thirdHeight);
        ctx.lineTo(cropRect.x + cropRect.width, cropRect.y + thirdHeight);
        ctx.moveTo(cropRect.x, cropRect.y + thirdHeight * 2);
        ctx.lineTo(cropRect.x + cropRect.width, cropRect.y + thirdHeight * 2);
        ctx.stroke();
      }
      
      // Draw resize handles
      const handleSize = 8;
      const halfHandle = handleSize / 2;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      
      // Corner handles
      const corners = [
        { x: cropRect.x - halfHandle, y: cropRect.y - halfHandle },
        { x: cropRect.x + cropRect.width - halfHandle, y: cropRect.y - halfHandle },
        { x: cropRect.x - halfHandle, y: cropRect.y + cropRect.height - halfHandle },
        { x: cropRect.x + cropRect.width - halfHandle, y: cropRect.y + cropRect.height - halfHandle }
      ];
      
      corners.forEach(corner => {
        ctx.fillRect(corner.x, corner.y, handleSize, handleSize);
        ctx.strokeRect(corner.x, corner.y, handleSize, handleSize);
      });
      
      // Edge handles
      const edges = [
        { x: cropRect.x + cropRect.width / 2 - halfHandle, y: cropRect.y - halfHandle }, // top
        { x: cropRect.x + cropRect.width / 2 - halfHandle, y: cropRect.y + cropRect.height - halfHandle }, // bottom
        { x: cropRect.x - halfHandle, y: cropRect.y + cropRect.height / 2 - halfHandle }, // left
        { x: cropRect.x + cropRect.width - halfHandle, y: cropRect.y + cropRect.height / 2 - halfHandle } // right
      ];
      
      edges.forEach(edge => {
        ctx.fillRect(edge.x, edge.y, handleSize, handleSize);
        ctx.strokeRect(edge.x, edge.y, handleSize, handleSize);
      });
    }
  }, [image, cropRect, showGrid]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX || 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY || 0 : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const getResizeHandle = (pos: { x: number; y: number }) => {
    const handleSize = 8;
    const tolerance = handleSize + 2;
    
    // Check corners first
    if (Math.abs(pos.x - cropRect.x) < tolerance && Math.abs(pos.y - cropRect.y) < tolerance) return 'nw';
    if (Math.abs(pos.x - (cropRect.x + cropRect.width)) < tolerance && Math.abs(pos.y - cropRect.y) < tolerance) return 'ne';
    if (Math.abs(pos.x - cropRect.x) < tolerance && Math.abs(pos.y - (cropRect.y + cropRect.height)) < tolerance) return 'sw';
    if (Math.abs(pos.x - (cropRect.x + cropRect.width)) < tolerance && Math.abs(pos.y - (cropRect.y + cropRect.height)) < tolerance) return 'se';
    
    // Check edges
    if (Math.abs(pos.x - (cropRect.x + cropRect.width / 2)) < tolerance && Math.abs(pos.y - cropRect.y) < tolerance) return 'n';
    if (Math.abs(pos.x - (cropRect.x + cropRect.width / 2)) < tolerance && Math.abs(pos.y - (cropRect.y + cropRect.height)) < tolerance) return 's';
    if (Math.abs(pos.x - cropRect.x) < tolerance && Math.abs(pos.y - (cropRect.y + cropRect.height / 2)) < tolerance) return 'w';
    if (Math.abs(pos.x - (cropRect.x + cropRect.width)) < tolerance && Math.abs(pos.y - (cropRect.y + cropRect.height / 2)) < tolerance) return 'e';
    
    return '';
  };

  const getCursor = (handle: string) => {
    switch (handle) {
      case 'nw':
      case 'se': return 'nw-resize';
      case 'ne':
      case 'sw': return 'ne-resize';
      case 'n':
      case 's': return 'ns-resize';
      case 'w':
      case 'e': return 'ew-resize';
      default: return 'move';
    }
  };

  const isInsideCrop = (pos: { x: number; y: number }) => {
    return pos.x >= cropRect.x && pos.x <= cropRect.x + cropRect.width &&
           pos.y >= cropRect.y && pos.y <= cropRect.y + cropRect.height;
  };

  const constrainRect = (rect: typeof cropRect) => {
    const canvas = canvasRef.current;
    if (!canvas) return rect;
    
    const minSize = 30;
    return {
      x: Math.max(0, Math.min(rect.x, canvas.width - minSize)),
      y: Math.max(0, Math.min(rect.y, canvas.height - minSize)),
      width: Math.max(minSize, Math.min(rect.width, canvas.width - rect.x)),
      height: Math.max(minSize, Math.min(rect.height, canvas.height - rect.y))
    };
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getEventPos(e);
    const handle = getResizeHandle(pos);
    
    setDragStart(pos);
    
    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else if (isInsideCrop(pos)) {
      setIsDragging(true);
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getEventPos(e);
    
    if (isResizing && resizeHandle) {
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      let newRect = { ...cropRect };
      
      switch (resizeHandle) {
        case 'nw':
          newRect = { x: cropRect.x + dx, y: cropRect.y + dy, width: cropRect.width - dx, height: cropRect.height - dy };
          break;
        case 'ne':
          newRect = { x: cropRect.x, y: cropRect.y + dy, width: cropRect.width + dx, height: cropRect.height - dy };
          break;
        case 'sw':
          newRect = { x: cropRect.x + dx, y: cropRect.y, width: cropRect.width - dx, height: cropRect.height + dy };
          break;
        case 'se':
          newRect = { x: cropRect.x, y: cropRect.y, width: cropRect.width + dx, height: cropRect.height + dy };
          break;
        case 'n':
          newRect = { x: cropRect.x, y: cropRect.y + dy, width: cropRect.width, height: cropRect.height - dy };
          break;
        case 's':
          newRect = { x: cropRect.x, y: cropRect.y, width: cropRect.width, height: cropRect.height + dy };
          break;
        case 'w':
          newRect = { x: cropRect.x + dx, y: cropRect.y, width: cropRect.width - dx, height: cropRect.height };
          break;
        case 'e':
          newRect = { x: cropRect.x, y: cropRect.y, width: cropRect.width + dx, height: cropRect.height };
          break;
      }
      
      setCropRect(constrainRect(newRect));
      setDragStart(pos);
    } else if (isDragging) {
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      const newRect = {
        x: cropRect.x + dx,
        y: cropRect.y + dy,
        width: cropRect.width,
        height: cropRect.height
      };
      
      setCropRect(constrainRect(newRect));
      setDragStart(pos);
    } else {
      // Update cursor based on position
      const canvas = canvasRef.current;
      if (canvas) {
        const handle = getResizeHandle(pos);
        canvas.style.cursor = handle ? getCursor(handle) : (isInsideCrop(pos) ? 'move' : 'crosshair');
      }
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  };

  const handleCrop = async () => {
    if (!canvasRef.current || !image || cropRect.width === 0 || cropRect.height === 0) {
      return;
    }

    // Create a new canvas for the cropped image
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    if (!croppedCtx) return;

    // Convert crop coordinates back to original image scale
    const originalCropRect = {
      x: cropRect.x / scale,
      y: cropRect.y / scale,
      width: cropRect.width / scale,
      height: cropRect.height / scale
    };

    croppedCanvas.width = originalCropRect.width;
    croppedCanvas.height = originalCropRect.height;

    // Draw the cropped portion
    croppedCtx.drawImage(
      image,
      originalCropRect.x,
      originalCropRect.y,
      originalCropRect.width,
      originalCropRect.height,
      0,
      0,
      originalCropRect.width,
      originalCropRect.height
    );

    // Convert to blob and then to file
    croppedCanvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], `${personName}-cropped.png`, { type: 'image/png' });
        onCrop(croppedFile);
      }
    }, 'image/png');
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const initialSize = Math.min(canvas.width, canvas.height) * 0.6;
      setCropRect({
        x: (canvas.width - initialSize) / 2,
        y: (canvas.height - initialSize) / 2,
        width: initialSize,
        height: initialSize
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Crop Image for {personName}</h3>
        <p className="text-sm text-muted-foreground">
          Select a square area to crop • Drag to move • Resize using handles • Toggle grid for alignment
        </p>
      </div>

      <Card className="p-4">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="border border-border rounded-lg touch-none"
            style={{ cursor: 'crosshair' }}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={() => setShowGrid(!showGrid)}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Grid3X3 className="w-4 h-4 mr-2" />
          {showGrid ? 'Hide Grid' : 'Show Grid'}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={handleCrop}
          disabled={cropRect.width === 0 || cropRect.height === 0}
          size="sm"
          className="flex-1 bg-gradient-primary text-white"
        >
          <Check className="w-4 h-4 mr-2" />
          Crop & Add
        </Button>
      </div>
    </div>
  );
};