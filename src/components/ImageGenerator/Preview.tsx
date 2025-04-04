import { memo, useRef, useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PreviewProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  pattern: string;
  background: string;
  title: string;
  subtitle: string;
  logo?: string;
}

const Preview = memo(({
  canvasRef,
  pattern,
  background,
  title,
  subtitle,
  logo
}: PreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [quality, setQuality] = useState<"standard" | "high" | "ultra">("standard");

  const downloadImage = useCallback(async () => {
    try {
      // Quality scale factors
      const scaleFactors = {
        standard: 1,
        high: 2,
        ultra: 4,
      };
      const scale = scaleFactors[quality];
      const renderWidth = 1200 * scale; // Standard OG image width
      const renderHeight = 630 * scale; // Standard OG image height

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

      // Create a linear gradient for SVG
      let gradientDef = '';
      let fillStyle = background;
      
      // Check if background is a linear gradient
      const gradientMatch = background.match(/linear-gradient\(([^)]+)\)/);
      if (gradientMatch) {
        const gradientContent = gradientMatch[1];
        
        // Parse angle and colors
        let angle = '0';
        let colors: {color: string, position: string}[] = [];
        
        // Parse gradient direction/angle
        if (gradientContent.includes('deg')) {
          const angleMatch = gradientContent.match(/(\d+)deg/);
          if (angleMatch) {
            angle = angleMatch[1];
          }
        }
        
        // Convert angle to x1,y1,x2,y2 coordinates
        let x1 = '0%', y1 = '0%', x2 = '100%', y2 = '0%';
        const numAngle = parseInt(angle);
        
        if (numAngle >= 0 && numAngle < 90) {
          x1 = '0%'; y1 = '100%'; x2 = '100%'; y2 = '0%';
        } else if (numAngle >= 90 && numAngle < 180) {
          x1 = '0%'; y1 = '0%'; x2 = '100%'; y2 = '100%';
        } else if (numAngle >= 180 && numAngle < 270) {
          x1 = '100%'; y1 = '0%'; x2 = '0%'; y2 = '100%';
        } else {
          x1 = '100%'; y1 = '100%'; x2 = '0%'; y2 = '0%';
        }
        
        // Parse color stops
        const colorRegex = /(#[0-9A-Fa-f]+|rgb\([^)]+\)|rgba\([^)]+\))\s*(\d+%)?/g;
        let match;
        let i = 0;
        
        while ((match = colorRegex.exec(gradientContent)) !== null) {
          const color = match[1];
          const position = match[2] || `${i === 0 ? '0' : '100'}%`;
          colors.push({ color, position });
          i++;
        }
        
        // Create gradient definition
        gradientDef = `
          <linearGradient id="backgroundGradient" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
            ${colors.map(c => `<stop offset="${c.position}" stop-color="${c.color}" />`).join('')}
          </linearGradient>
        `;
        
        fillStyle = "url(#backgroundGradient)";
      }

      // Generate SVG content
      let svgContent = `
        <svg width="${renderWidth}" height="${renderHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            ${gradientDef}
            ${patternUrl ? `
              <pattern id="pattern" patternUnits="userSpaceOnUse" 
                width="${patternSize}" height="${patternSize}">
                <image href="${patternUrl}" width="${patternSize}" height="${patternSize}" />
              </pattern>
            ` : ''}
          </defs>
          
          <!-- Background -->
          <rect width="${renderWidth}" height="${renderHeight}" fill="${fillStyle}" />
          
          <!-- Pattern -->
          ${patternUrl ? `
            <rect width="${renderWidth}" height="${renderHeight}" 
              fill="url(#pattern)" />
          ` : ''}
      `;

      // Add logo if present
      if (logo) {
        const logoMaxWidth = renderWidth * 0.3;
        const logoMaxHeight = renderHeight * 0.15;
        const logoX = (renderWidth - logoMaxWidth) / 2;
        const logoY = renderHeight * 0.25;

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

      // Create a Blob containing the SVG data
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Create an Image object to load the SVG
      const img = new Image();
      
      // Wait for the image to load
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => {
          console.error("Image loading error:", e);
          reject(new Error("Failed to load SVG"));
        };
        img.src = svgUrl;
      });

      // Create a canvas with the dimensions
      const canvas = document.createElement('canvas');
      canvas.width = renderWidth;
      canvas.height = renderHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Unable to create canvas context");
      
      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, renderWidth, renderHeight);
      
      // Clean up the object URL
      URL.revokeObjectURL(svgUrl);

      // Download the image
      const link = document.createElement('a');
      link.download = `og-image-${quality}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`OG image downloaded (${quality} - ${renderWidth}x${renderHeight}px)`);

    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    }
  }, [canvasRef, pattern, background, title, subtitle, logo, quality]);

  const copyToClipboard = async () => {
    try {
      if (!canvasRef.current) return;
      
      const canvas = document.createElement('canvas');
      const width = 1200;
      const height = 630;
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Create a temporary div with the same styling as the preview
      const tempDiv = document.createElement('div');
      tempDiv.style.width = `${width}px`;
      tempDiv.style.height = `${height}px`;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      
      // Clone the content
      if (canvasRef.current) {
        const clone = canvasRef.current.cloneNode(true) as HTMLElement;
        clone.style.width = `${width}px`;
        clone.style.height = `${height}px`;
        tempDiv.appendChild(clone);
        document.body.appendChild(tempDiv);
      }
      
      // Use html2canvas or similar library here for more complex rendering
      // For now, we'll just use a simple canvas with background color
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      
      // Try to copy to clipboard
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            toast.success('Image copied to clipboard');
          } catch (err) {
            console.error('Clipboard error:', err);
            toast.error('Failed to copy to clipboard');
          }
        }
        document.body.removeChild(tempDiv);
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

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
    <div className="sticky top-4" style={{ position: "-webkit-sticky" }}>
      <div className="flex justify-between items-center w-full mb-4">
        <div>
          <p className="text-base font-medium">OG Image</p>
          <p className="text-xs text-muted-foreground">1200 × 630px</p>
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
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1.5"
            onClick={downloadImage}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>
      
      <div 
        ref={previewRef}
        className="w-full rounded-lg overflow-hidden border border-white/10 shadow-lg relative animate-scale-in"
        style={{ 
          aspectRatio: `1200/630`,
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
            <div className="mb-4 max-w-[30%] max-h-[15%]">
              <img src={logo} alt="Logo" className="max-h-full max-w-full object-contain" />
            </div>
          )}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-3">{title}</h2>
          <p className="text-sm sm:text-base text-white/80">{subtitle}</p>
        </div>
      </div>
      
      <div className="mt-6 glass-morphism rounded-lg border border-white/10 p-4">
        <h3 className="text-lg font-medium mb-2">About OG Images</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Open Graph (OG) images are essential for creating engaging social media previews when your content is shared online.
        </p>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li className="flex gap-2 items-start">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <span>OG images appear when your content is shared on platforms like Twitter, Facebook, LinkedIn, and Discord.</span>
          </li>
          <li className="flex gap-2 items-start">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <span>The standard size for OG images is 1200×630 pixels, which provides optimal display across platforms.</span>
          </li>
          <li className="flex gap-2 items-start">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <span>High-quality OG images can significantly increase engagement and click-through rates for your content.</span>
          </li>
        </ul>
      </div>
    </div>
  );
});

Preview.displayName = "Preview";

export default Preview;

// Add necessary imports at the top of the file
import { CheckCircle2 } from "lucide-react";