// PlatformPreview.tsx
import { memo, useRef, useCallback, useState } from "react";
import { PLATFORM_DIMENSIONS } from "@/lib/pattern-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const previewRef = useRef<HTMLDivElement>(null);
  const [quality, setQuality] = useState<"standard" | "high" | "ultra">("standard");

  const downloadSvg = useCallback(async () => {
    try {
      // Quality scale factors
      const scaleFactors = {
        standard: 1,
        high: 2,
        ultra: 4,
      };
      const scale = scaleFactors[quality];
      const renderWidth = width * scale;
      const renderHeight = height * scale;

      // Extract pattern URL
      let patternUrl = '';
      const patternMatch = pattern.match(/url\("([^"]+)"\)/);
      if (patternMatch && patternMatch[1]) {
        patternUrl = patternMatch[1];
      }

      // Calculate pattern size
      const patternSize = parseInt(canvasRef.current?.style.backgroundSize || '40') * scale;

      // Wrap text function for SVG
      const wrapText = (text: string, maxWidth: number, fontSize: number): { lines: string[], lineHeight: number } => {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return { lines: [text], lineHeight: fontSize };
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
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
        return { lines, lineHeight: fontSize * 1.2 };
      };

      // Generate SVG content
      let svgContent = `
        <svg width="${renderWidth}" height="${renderHeight}" xmlns="http://www.w3.org/2000/svg">
          <!-- Background -->
          <rect width="${renderWidth}" height="${renderHeight}" fill="${background}" />
          
          <!-- Pattern -->
          ${patternUrl ? `
            <rect width="${renderWidth}" height="${renderHeight}" 
              fill="url(#pattern)" />
            <defs>
              <pattern id="pattern" patternUnits="userSpaceOnUse" 
                width="${patternSize}" height="${patternSize}">
                <image href="${patternUrl}" width="${patternSize}" height="${patternSize}" />
              </pattern>
            </defs>
          ` : ''}
      `;

      // Add logo if present
      if (logo) {
        const logoMaxWidth = renderWidth * 0.3;
        const logoMaxHeight = renderHeight * 0.15;
        const logoX = (renderWidth - logoMaxWidth) / 2;
        const logoY = renderHeight * 0.25;

        // For simplicity, we'll assume the logo scales proportionally
        svgContent += `
          <image href="${logo}" x="${logoX}" y="${logoY}" 
            width="${logoMaxWidth}" height="${logoMaxHeight}" 
            preserveAspectRatio="xMidYMid meet" />
        `;
      }

      // Add title
      const titleFontSize = renderWidth * 0.05;
      const { lines: titleLines, lineHeight: titleLineHeight } = wrapText(title, renderWidth * 0.8, titleFontSize);
      const titleYStart = logo ? renderHeight * 0.5 : renderHeight * 0.4;
      titleLines.forEach((line, i) => {
        svgContent += `
          <text x="${renderWidth / 2}" y="${titleYStart + (i * titleLineHeight)}" 
            font-family="Inter, sans-serif" font-size="${titleFontSize}" 
            font-weight="bold" fill="white" text-anchor="middle" 
            dominant-baseline="middle">${escapeHtml(line)}</text>
        `;
      });

      // Add subtitle
      const subtitleFontSize = renderWidth * 0.025;
      const { lines: subtitleLines, lineHeight: subtitleLineHeight } = wrapText(subtitle, renderWidth * 0.7, subtitleFontSize);
      const subtitleYStart = titleYStart + (titleLines.length * titleLineHeight) + (renderWidth * 0.04);
      subtitleLines.forEach((line, i) => {
        svgContent += `
          <text x="${renderWidth / 2}" y="${subtitleYStart + (i * subtitleLineHeight)}" 
            font-family="Inter, sans-serif" font-size="${subtitleFontSize}" 
            fill="rgba(255, 255, 255, 0.8)" text-anchor="middle" 
            dominant-baseline="middle">${escapeHtml(line)}</text>
        `;
      });

      svgContent += `</svg>`;

      // Convert SVG to PNG
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const img = new Image();
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load SVG"));
        img.src = svgUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = renderWidth;
      canvas.height = renderHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Unable to create canvas context");
      
      ctx.drawImage(img, 0, 0, renderWidth, renderHeight);
      URL.revokeObjectURL(svgUrl);

      // Download the image
      const link = document.createElement('a');
      link.download = `og-image-${platform}-${quality}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${label} image downloaded (${quality})`);

    } catch (error) {
      console.error("Error generating SVG:", error);
      toast.error("Failed to generate image");
    }
  }, [canvasRef, pattern, background, title, subtitle, logo, platform, width, height, label, quality]);

  // Helper function to escape HTML characters
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  return (
    <Card className="border-white/10 overflow-hidden h-full">
      <div className="glass-morphism p-4 flex flex-col items-center gap-4 h-full">
        <div className="flex justify-between items-center w-full">
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{width} × {height}px</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={quality} onValueChange={(value) => setQuality(value as "standard" | "high" | "ultra")}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="ultra">Ultra</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5"
              onClick={downloadSvg}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>
        
        <div 
          ref={previewRef}
          className="w-full rounded-lg overflow-hidden border border-white/10 shadow-lg relative"
          style={{ 
            aspectRatio: `${width}/${height}`,
          }}
        >
          <div 
            className="absolute inset-0"
            style={{ background }}
          />
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: pattern,
              backgroundSize: canvasRef.current?.style.backgroundSize || '40px',
            }}
          />
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 text-center">
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
    </Card>
  );
});

PlatformPreview.displayName = "PlatformPreview";

export default PlatformPreview;