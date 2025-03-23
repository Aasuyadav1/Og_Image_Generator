
import { memo, useRef } from "react";
import { PLATFORM_DIMENSIONS } from "@/lib/pattern-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface PlatformPreviewProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  pattern: string;
  background: string;
  title: string;
  subtitle: string;
  logo?: string;
  platform: keyof typeof PLATFORM_DIMENSIONS;
}

const PlatformPreview = memo(({
  canvasRef,
  pattern,
  background,
  title,
  subtitle,
  logo,
  platform
}: PlatformPreviewProps) => {
  const { width, height, label } = PLATFORM_DIMENSIONS[platform];

  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    
    try {
      // Create a canvas to draw our image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        toast.error("Unable to create canvas context");
        return;
      }
      
      // Draw background with pattern
      const img = new Image();
      const div = canvasRef.current;
      
      // First, draw the background
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      
      // Create temporary image for the pattern
      const patternImg = new Image();
      patternImg.onload = () => {
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = width;
        patternCanvas.height = height;
        const patternCtx = patternCanvas.getContext('2d');
        
        if (patternCtx) {
          const pattern = patternCtx.createPattern(patternImg, 'repeat');
          if (pattern) {
            patternCtx.fillStyle = pattern;
            patternCtx.fillRect(0, 0, width, height);
            ctx.drawImage(patternCanvas, 0, 0);
          }
          
          // Draw the content
          // Draw title
          ctx.font = `bold ${width * 0.05}px Inter, sans-serif`;
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Split title into multiple lines if needed
          const titleLines = wrapText(ctx, title, width * 0.8, width * 0.05);
          let titleY = height * 0.4;
          if (logo) titleY = height * 0.5;
          
          titleLines.forEach((line, i) => {
            ctx.fillText(line, width / 2, titleY + (i * width * 0.06));
          });
          
          // Draw subtitle
          ctx.font = `${width * 0.025}px Inter, sans-serif`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          
          const subtitleLines = wrapText(ctx, subtitle, width * 0.7, width * 0.025);
          let subtitleY = titleY + (titleLines.length * width * 0.06) + width * 0.04;
          
          subtitleLines.forEach((line, i) => {
            ctx.fillText(line, width / 2, subtitleY + (i * width * 0.035));
          });
          
          // Draw logo if exists
          if (logo) {
            const logoImg = new Image();
            logoImg.onload = () => {
              const logoMaxHeight = height * 0.15;
              const logoMaxWidth = width * 0.3;
              
              let logoWidth = logoImg.width;
              let logoHeight = logoImg.height;
              
              if (logoWidth > logoMaxWidth) {
                logoHeight = (logoHeight * logoMaxWidth) / logoWidth;
                logoWidth = logoMaxWidth;
              }
              
              if (logoHeight > logoMaxHeight) {
                logoWidth = (logoWidth * logoMaxHeight) / logoHeight;
                logoHeight = logoMaxHeight;
              }
              
              const logoX = (width - logoWidth) / 2;
              const logoY = height * 0.25;
              
              ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
              
              // Download the image
              finishDownload(canvas);
            };
            logoImg.src = logo;
          } else {
            // Download the image
            finishDownload(canvas);
          }
        }
      };
      
      // Create a data URL from the div's background
      const bgCanvas = document.createElement('canvas');
      bgCanvas.width = 10;
      bgCanvas.height = 10;
      const bgCtx = bgCanvas.getContext('2d');
      if (bgCtx) {
        bgCtx.fillStyle = 'transparent';
        bgCtx.fillRect(0, 0, 10, 10);
      }
      
      // Extract pattern from the computed style
      const computedStyle = window.getComputedStyle(div);
      const bgImage = computedStyle.backgroundImage;
      
      // If we have a pattern
      if (bgImage && bgImage !== 'none') {
        const patternUrlMatch = bgImage.match(/url\("([^"]+)"\)/);
        if (patternUrlMatch && patternUrlMatch[1]) {
          patternImg.src = patternUrlMatch[1];
        } else {
          // No pattern, just proceed
          finishDownload(canvas);
        }
      } else {
        // No pattern, just proceed
        finishDownload(canvas);
      }
    } catch (error) {
      console.error("Error generating canvas:", error);
      toast.error("Failed to generate image");
    }
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const finishDownload = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = `og-image-${platform}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${label} image downloaded`);
  };

  return (
    <Card className="border-white/10 overflow-hidden h-full">
      <div className="glass-morphism p-4 flex flex-col items-center gap-4 h-full">
        <div className="flex justify-between items-center w-full">
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{width} × {height}px</p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5"
            onClick={downloadCanvas}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
        
        <div className="w-full rounded-lg overflow-hidden border border-white/10 shadow-lg">
          <div 
            className="aspect-[1200/630] w-full relative flex items-center justify-center"
            style={{ 
              backgroundImage: pattern,
              background: background,
            } as React.CSSProperties}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              {logo && (
                <div className="mb-2 max-w-[30%] max-h-[15%]">
                  <img src={logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                </div>
              )}
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight mb-1">{title}</h2>
              <p className="text-xs text-white/80">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

PlatformPreview.displayName = "PlatformPreview";

export default PlatformPreview;
