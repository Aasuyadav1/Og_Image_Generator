import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";
import { PatternSettings } from "@/lib/pattern-utils";

interface ImagePreviewProps {
  content: {
    title: string;
    subtitle: string;
    image?: string;
    layout: "centered" | "left-image" | "right-image" | "bottom-image" | "top-image" | "overlay";
    textAlign?: "left" | "center" | "right";
  };
  patternStyle: PatternSettings;
  background: string;
  patternUrl: string;
}

const ImagePreview = ({ content, patternStyle, background, patternUrl }: ImagePreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);

  // Render content for preview (unchanged)
  const renderPreviewContent = () => {
    const { layout, title, subtitle, image, textAlign } = content;

    const titleClass = `font-bold text-white leading-tight mb-3 ${
      textAlign === "left" ? "text-left" : textAlign === "right" ? "text-right" : "text-center"
    }`;
    const subtitleClass = `text-white/80 ${
      textAlign === "left" ? "text-left" : textAlign === "right" ? "text-right" : "text-center"
    }`;

    switch (layout) {
      case "left-image":
        return (
          <div className="flex flex-row h-full w-full">
            {image && (
              <div className="w-1/2 h-full flex items-center justify-center mt-14">
                <img src={image} alt="Featured" className="h-full max-w-full object-right object-cover rounded-tr-xl" />
              </div>
            )}
            <div className={`${image ? "w-1/2" : "w-full"} h-full flex flex-col justify-center p-8`}>
              <h2 className={`text-xl !text-left sm:text-2xl md:text-3xl ${titleClass}`}>{title}</h2>
              <p className={`text-sm !text-left sm:text-base ${subtitleClass}`}>{subtitle}</p>
            </div>
          </div>
        );
      case "right-image":
        return (
          <div className="flex flex-row h-full w-full">
            <div className={`${image ? "w-1/2" : "w-full"} h-full flex flex-col justify-center p-8`}>
              <h2 className={`text-xl !text-left sm:text-2xl md:text-3xl ${titleClass}`}>{title}</h2>
              <p className={`text-sm !text-left sm:text-base ${subtitleClass}`}>{subtitle}</p>
            </div>
            {image && (
              <div className="w-1/2 h-full flex items-center justify-center mt-14">
                <img src={image} alt="Featured" className="h-full w-full object-left object-cover rounded-tl-xl" />
              </div>
            )}
          </div>
        );
      case "bottom-image":
        return (
          <div className="flex flex-col h-full w-full">
            <div className="flex-1 flex flex-col justify-center p-8">
              <h2 className={`text-xl sm:text-2xl !text-center md:text-3xl ${titleClass}`}>{title}</h2>
              <p className={`text-sm sm:text-base !text-center ${subtitleClass}`}>{subtitle}</p>
            </div>
            {image && (
              <div className="w-full flex items-center justify-center">
                <img src={image} alt="Featured" className="w-[95%] object-cover h-full rounded-t-xl" />
              </div>
            )}
          </div>
        );
      case "top-image":
        return (
          <div className="flex flex-col h-full w-full">
            {image && (
              <div className="w-full">
                <img src={image} alt="Featured" className="w-full object-cover" style={{ maxHeight: "50%" }} />
              </div>
            )}
            <div className="flex-1 flex flex-col justify-center p-8">
              <h2 className={`text-xl sm:text-2xl md:text-3xl ${titleClass}`}>{title}</h2>
              <p className={`text-sm sm:text-base ${subtitleClass}`}>{subtitle}</p>
            </div>
          </div>
        );
      case "overlay":
        return (
          <div className="relative h-full w-full">
            {image && <img src={image} alt="Background" className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative flex flex-col h-full w-full items-center justify-center p-8 text-center">
              <h2 className={`text-xl sm:text-2xl md:text-3xl ${titleClass}`}>{title}</h2>
              <p className={`text-sm sm:text-base ${subtitleClass}`}>{subtitle}</p>
            </div>
          </div>
        );
      case "centered":
      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
            {image && (
              <div className="mb-6 max-w-[30%] max-h-[15%]">
                <img src={image} alt="Logo" className="max-h-full max-w-full object-contain" />
              </div>
            )}
            <h2 className={`text-xl sm:text-2xl md:text-3xl ${titleClass}`}>{title}</h2>
            <p className={`text-sm sm:text-base ${subtitleClass}`}>{subtitle}</p>
          </div>
        );
    }
  };

  const downloadImage = useCallback(
    async (format: "svg" | "png" | "jpeg") => {
      try {
        const width = 1200;
        const height = 630;

        // Adjusted font sizes for exported images (larger than preview)
        const titleFontSize = 48; // Increased from 36
        const subtitleFontSize = 24; // Increased from 16

        // Fetch image as base64 if it exists
        let imageBase64 = "";
        if (content.image) {
          const response = await fetch(content.image);
          const blob = await response.blob();
          imageBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        }

        // Extract pattern URL
        let patternUrlExtracted = patternUrl;
        const patternMatch = patternUrl.match(/url\("([^"]+)"\)/);
        if (patternMatch && patternMatch[1]) {
          patternUrlExtracted = patternMatch[1];
        }

        const patternSize = patternStyle.scale * 2;

        // Wrap text function for SVG
        const wrapText = (text: string, maxWidth: number, fontSize: number): { lines: string[]; lineHeight: number } => {
          const tempCanvas = document.createElement("canvas");
          const ctx = tempCanvas.getContext("2d");
          if (!ctx) return { lines: [text], lineHeight: fontSize };
          ctx.font = `bold ${fontSize}px Inter, sans-serif`;
          const words = text.split(" ");
          const lines: string[] = [];
          let currentLine = words[0];

          for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
              currentLine += " " + word;
            } else {
              lines.push(currentLine);
              currentLine = word;
            }
          }
          lines.push(currentLine);
          return { lines, lineHeight: fontSize * 1.2 };
        };

        // Handle gradient background
        let gradientDef = "";
        let fillStyle = background;
        const gradientMatch = background.match(/linear-gradient\(([^)]+)\)/);
        if (gradientMatch) {
          const gradientContent = gradientMatch[1];
          let angle = "0";
          let colors: { color: string; position: string }[] = [];

          if (gradientContent.includes("deg")) {
            const angleMatch = gradientContent.match(/(\d+)deg/);
            if (angleMatch) angle = angleMatch[1];
          }

          let x1 = "0%", y1 = "0%", x2 = "100%", y2 = "0%";
          const numAngle = parseInt(angle);
          if (numAngle >= 0 && numAngle < 90) {
            x1 = "0%"; y1 = "100%"; x2 = "100%"; y2 = "0%";
          } else if (numAngle >= 90 && numAngle < 180) {
            x1 = "0%"; y1 = "0%"; x2 = "100%"; y2 = "100%";
          } else if (numAngle >= 180 && numAngle < 270) {
            x1 = "100%"; y1 = "0%"; x2 = "0%"; y2 = "100%";
          } else {
            x1 = "100%"; y1 = "100%"; x2 = "0%"; y2 = "0%";
          }

          const colorRegex = /(#[0-9A-Fa-f]+|rgb\([^)]+\)|rgba\([^)]+\))\s*(\d+%)?/g;
          let match;
          let i = 0;
          while ((match = colorRegex.exec(gradientContent)) !== null) {
            const color = match[1];
            const position = match[2] || `${i === 0 ? "0" : "100"}%`;
            colors.push({ color, position });
            i++;
          }

          gradientDef = `
            <linearGradient id="backgroundGradient" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
              ${colors.map((c) => `<stop offset="${c.position}" stop-color="${c.color}" />`).join("")}
            </linearGradient>
          `;
          fillStyle = "url(#backgroundGradient)";
        }

        // Base SVG structure with clip paths for border radius
        let svgContent = `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              ${gradientDef}
              ${patternUrlExtracted ? `
                <pattern id="pattern" patternUnits="userSpaceOnUse" 
                  width="${patternSize}" height="${patternSize}">
                  <image href="${patternUrlExtracted}" width="${patternSize}" height="${patternSize}" />
                </pattern>
              ` : ""}
              
              <!-- Define clip paths for image border radius -->
              <clipPath id="roundedTopRight">
                <rect x="0" y="0" width="100%" height="100%" rx="12" ry="12" />
              </clipPath>
              <clipPath id="roundedTopLeft">
                <rect x="0" y="0" width="100%" height="100%" rx="12" ry="12" />
              </clipPath>
              <clipPath id="roundedTop">
                <rect x="0" y="0" width="100%" height="100%" rx="12" ry="12" />
              </clipPath>
            </defs>
            <rect width="${width}" height="${height}" fill="${fillStyle}" />
            ${patternUrlExtracted ? `<rect width="${width}" height="${height}" fill="url(#pattern)" />` : ""}
        `;

        const { layout, title, subtitle, textAlign } = content;
        const padding = 80; // Slightly increased padding for larger export
        const marginTop = 56; // Equivalent to mt-14 (56px) for downloaded image

        switch (layout) {
          case "left-image": {
            if (imageBase64) {
              // Apply marginTop to the image positioning and use clip path for rounded corners
              svgContent += `
                <g clip-path="url(#roundedTopRight)">
                  <image href="${imageBase64}" x="0" y="${marginTop}" width="${width / 2}" height="${height - marginTop}" preserveAspectRatio="xMaxYMid slice" />
                </g>
              `;
            }
            const textX = imageBase64 ? width / 2 + padding : padding;
            const textWidth = imageBase64 ? width / 2 - padding * 2 : width - padding * 2;
            const { lines: titleLines, lineHeight: titleLineHeight } = wrapText(title, textWidth, titleFontSize);
            const { lines: subtitleLines, lineHeight: subtitleLineHeight } = wrapText(subtitle, textWidth, subtitleFontSize);
            const totalTextHeight = titleLines.length * titleLineHeight + subtitleLines.length * subtitleLineHeight + 12;
            const textYStart = (height - totalTextHeight) / 2;
            titleLines.forEach((line, i) => {
              svgContent += `
                <text x="${textX}" y="${textYStart + i * titleLineHeight}" 
                  font-family="Inter, sans-serif" font-size="${titleFontSize}" 
                  font-weight="bold" fill="white" text-anchor="start" 
                  dominant-baseline="middle">${escapeHtml(line)}</text>
              `;
            });
            subtitleLines.forEach((line, i) => {
              svgContent += `
                <text x="${textX}" y="${textYStart + titleLines.length * titleLineHeight + 20 + i * subtitleLineHeight}" 
                  font-family="Inter, sans-serif" font-size="${subtitleFontSize}" 
                  fill="rgba(255, 255, 255, 0.8)" text-anchor="start" 
                  dominant-baseline="middle">${escapeHtml(line)}</text>
              `;
            });
            break;
          }
          case "right-image": {
            const textWidth = imageBase64 ? width / 2 - padding * 2 : width - padding * 2;
            const textX = padding;
            const { lines: titleLines, lineHeight: titleLineHeight } = wrapText(title, textWidth, titleFontSize);
            const { lines: subtitleLines, lineHeight: subtitleLineHeight } = wrapText(subtitle, textWidth, subtitleFontSize);
            const totalTextHeight = titleLines.length * titleLineHeight + subtitleLines.length * subtitleLineHeight + 12;
            const textYStart = (height - totalTextHeight) / 2;
            titleLines.forEach((line, i) => {
              svgContent += `
                <text x="${textX}" y="${textYStart + i * titleLineHeight}" 
                  font-family="Inter, sans-serif" font-size="${titleFontSize}" 
                  font-weight="bold" fill="white" text-anchor="start" 
                  dominant-baseline="middle">${escapeHtml(line)}</text>
              `;
            });
            subtitleLines.forEach((line, i) => {
              svgContent += `
                <text x="${textX}" y="${textYStart + titleLines.length * titleLineHeight + 20 + i * subtitleLineHeight}" 
                  font-family="Inter, sans-serif" font-size="${subtitleFontSize}" 
                  fill="rgba(255, 255, 255, 0.8)" text-anchor="start" 
                  dominant-baseline="middle">${escapeHtml(line)}</text>
              `;
            });
            if (imageBase64) {
              // Apply marginTop to the image positioning and use clip path for rounded corners
              svgContent += `
                <g clip-path="url(#roundedTopLeft)">
                  <image href="${imageBase64}" x="${width / 2}" y="${marginTop}" width="${width / 2}" height="${height - marginTop}" preserveAspectRatio="xMinYMid slice" />
                </g>
              `;
            }
            break;
          }
          case "bottom-image": {
            // Calculate better proportions so the image doesn't sit too low
            const textHeight = imageBase64 ? height * 0.55 : height; // Slightly larger text area (55% instead of 50%)
            const imageHeight = imageBase64 ? height * 0.45 : 0; // Smaller image area (45% instead of 50%)
            
            const { lines: titleLines, lineHeight: titleLineHeight } = wrapText(title, width - padding * 2, titleFontSize);
            const { lines: subtitleLines, lineHeight: subtitleLineHeight } = wrapText(subtitle, width - padding * 2, subtitleFontSize);
            const totalTextHeight = titleLines.length * titleLineHeight + subtitleLines.length * subtitleLineHeight + 20;
            const textYStart = (textHeight - totalTextHeight) / 2;
            
            titleLines.forEach((line, i) => {
              svgContent += `
                <text x="${width / 2}" y="${textYStart + i * titleLineHeight}" 
                  font-family="Inter, sans-serif" font-size="${titleFontSize}" 
                  font-weight="bold" fill="white" text-anchor="middle" 
                  dominant-baseline="middle">${escapeHtml(line)}</text>
              `;
            });
            subtitleLines.forEach((line, i) => {
              svgContent += `
                <text x="${width / 2}" y="${textYStart + titleLines.length * titleLineHeight + 20 + i * subtitleLineHeight}" 
                  font-family="Inter, sans-serif" font-size="${subtitleFontSize}" 
                  fill="rgba(255, 255, 255, 0.8)" text-anchor="middle" 
                  dominant-baseline="middle">${escapeHtml(line)}</text>
              `;
            });
            if (imageBase64) {
              // Position the image at the calculated position, adding rounded corners with clip path
              svgContent += `
                <g clip-path="url(#roundedTop)">
                  <image href="${imageBase64}" x="${width * 0.025}" y="${textHeight}" width="${width * 0.95}" height="${imageHeight}" preserveAspectRatio="xMidYMid slice" />
                </g>
              `;
            }
            break;
          }
          case "top-image": {
            if (imageBase64) {
              svgContent += `<image href="${imageBase64}" x="0" y="0" width="${width}" height="${height / 2}" preserveAspectRatio="xMidYMid slice" />`;
            }
            const textHeight = imageBase64 ? height / 2 : height;
            const textYStartOffset = imageBase64 ? height / 2 : 0;
            const { lines: titleLines, lineHeight: titleLineHeight } = wrapText(title, width - padding * 2, titleFontSize);
            const { lines: subtitleLines, lineHeight: subtitleLineHeight } = wrapText(subtitle, width - padding * 2, subtitleFontSize);
            const totalTextHeight = titleLines.length * titleLineHeight + subtitleLines.length * subtitleLineHeight + 20;
            const textYStart = textYStartOffset + (textHeight - totalTextHeight) / 2;
            
            // Add text alignment support based on textAlign prop
            const textAnchor = textAlign === "left" ? "start" : textAlign === "right" ? "end" : "middle";
            const xPos = textAlign === "left" ? padding : textAlign === "right" ? width - padding : width / 2;
            
            titleLines.forEach((line, i) => {
              svgContent += `
                <text x="${xPos}" y="${textYStart + i * titleLineHeight}" 
                  font-family="Inter, sans-serif" font-size="${titleFontSize}" 
                  font-weight="bold" fill="white" text-anchor="${textAnchor}" 
                  dominant-baseline="middle">${escapeHtml(line)}</text>
              `;
            });
            subtitleLines.forEach((line, i) => {
              svgContent += `
                <text x="${xPos}" y="${textYStart + titleLines.length * titleLineHeight + 20 + i * subtitleLineHeight}" 
                  font-family="Inter, sans-serif" font-size="${subtitleFontSize}" 
                  fill="rgba(255, 255, 255, 0.8)" text-anchor="${textAnchor}" 
                  dominant-baseline="middle">${escapeHtml(line)}</text>
              `;
            });
            break;
          }
          case "overlay": {
            if (imageBase64) {
              svgContent += `<image href="${imageBase64}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" />`;
              svgContent += `<rect width="${width}" height="${height}" fill="rgba(0, 0, 0, 0.5)" />`;
            }
            const { lines: titleLines, lineHeight: titleLineHeight } = wrapText(title, width - padding * 2, titleFontSize);
            const { lines: subtitleLines, lineHeight: subtitleLineHeight } = wrapText(subtitle, width - padding * 2, subtitleFontSize);
            const totalTextHeight = titleLines.length * titleLineHeight + subtitleLines.length * subtitleLineHeight + 20;
            const textYStart = (height - totalTextHeight) / 2;
            titleLines.forEach((line, i) => {
              svgContent += `
                <text x="${width / 2}" y="${textYStart + i * titleLineHeight}" 
                  font-family="Inter, sans-serif" font-size="${titleFontSize}" 
                  font-weight="bold" fill="white" text-anchor="middle" 
                  dominant-baseline="middle">${escapeHtml(line)}</text>
              `;
            });
            subtitleLines.forEach((line, i) => {
              svgContent += `
                <text x="${width / 2}" y="${textYStart + titleLines.length * titleLineHeight + 20 + i * subtitleLineHeight}" 
                  font-family="Inter, sans-serif" font-size="${subtitleFontSize}" 
                  fill="rgba(255, 255, 255, 0.8)" text-anchor="middle" 
                  dominant-baseline="middle">${escapeHtml(line)}</text>
              `;
            });
            break;
          }
          case "centered":
          default: {
            const logoMaxWidth = width * 0.3;
            const logoMaxHeight = height * 0.15;
            const { lines: titleLines, lineHeight: titleLineHeight } = wrapText(title, width - padding * 2, titleFontSize);
            const { lines: subtitleLines, lineHeight: subtitleLineHeight } = wrapText(subtitle, width - padding * 2, subtitleFontSize);
            const totalTextHeight = titleLines.length * titleLineHeight + subtitleLines.length * subtitleLineHeight + 20;
            const logoHeight = imageBase64 ? logoMaxHeight : 0;
            const totalHeight = logoHeight + totalTextHeight + (imageBase64 ? 24 : 0);
            const yStart = (height - totalHeight) / 2;
            if (imageBase64) {
              svgContent += `
                <image href="${imageBase64}" x="${(width - logoMaxWidth) / 2}" y="${yStart}" 
                  width="${logoMaxWidth}" height="${logoMaxHeight}" preserveAspectRatio="xMidYMid meet" />
              `;
            }
            titleLines.forEach((line, i) => {
              svgContent += `
                <text x="${width / 2}" y="${yStart + logoHeight + (imageBase64 ? 24 : 0) + i * titleLineHeight}" 
                  font-family="Inter, sans-serif" font-size="${titleFontSize}" 
                  font-weight="bold" fill="white" text-anchor="middle" 
                  dominant-baseline="middle">${escapeHtml(line)}</text>
              `;
            });
            subtitleLines.forEach((line, i) => {
              svgContent += `
                <text x="${width / 2}" y="${yStart + logoHeight + (imageBase64 ? 24 : 0) + titleLines.length * titleLineHeight + 20 + i * subtitleLineHeight}" 
                  font-family="Inter, sans-serif" font-size="${subtitleFontSize}" 
                  fill="rgba(255, 255, 255, 0.8)" text-anchor="middle" 
                  dominant-baseline="middle">${escapeHtml(line)}</text>
              `;
            });
            break;
          }
        }

        svgContent += `</svg>`;

        if (format === "svg") {
          const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
          const svgUrl = URL.createObjectURL(svgBlob);
          const link = document.createElement("a");
          link.download = "og-image.svg";
          link.href = svgUrl;
          link.click();
          URL.revokeObjectURL(svgUrl);
          toast.success("SVG downloaded successfully");
        } else {
          const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
          const svgUrl = URL.createObjectURL(svgBlob);
          const img = new Image();

          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = (e) => {
              console.error("Image loading error:", e);
              reject(new Error("Failed to load SVG"));
            };
            img.src = svgUrl;
          });

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Unable to create canvas context");

          ctx.drawImage(img, 0, 0, width, height);
          URL.revokeObjectURL(svgUrl);

          const link = document.createElement("a");
          link.download = `og-image.${format}`;
          link.href = canvas.toDataURL(`image/${format}`, format === "jpeg" ? 0.95 : 1.0); // Higher quality for JPEG
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success(`${format.toUpperCase()} downloaded successfully`);
        }
      } catch (error) {
        console.error("Error generating image:", error);
        toast.error(`Failed to download ${format.toUpperCase()}`);
      }
    },
    [content, patternStyle, background, patternUrl]
  );

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
    <div className="relative h-full">
      <div className="w-full justify-between flex items-center">
      <h2 className="text-lg font-medium w-fit inline-block">Preview</h2>
      <div className="flex gap-2 w-fit">
          {/* <Button onClick={() => downloadImage("svg")} className="gap-1.5">
            <Download className="h-4 w-4" />
            SVG
          </Button> */}
          <Button onClick={() => downloadImage("png")} className="gap-1.5 !py-1 !px-4">
            <Download className="h-2 w-2" />
            PNG
          </Button>
          <Button onClick={() => downloadImage("jpeg")} className="gap-1.5 !py-1 !px-4">
            <Download className="h-2 w-2" />
            JPEG
          </Button>
        </div>
      </div>
      <div className="sticky top-4 mb-4 mt-4 bg-background" style={{ position: "-webkit-sticky" }}>
        <div
          ref={previewRef}
          className="aspect-[1200/630] w-full rounded-lg overflow-hidden border border-white/10 shadow-xl animate-scale-in relative"
        >
          <div className="absolute inset-0" style={{ background }} />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: patternUrl,
              backgroundSize: `${patternStyle.scale * 2}px`,
            }}
          />
          <div className="relative w-full h-full">{renderPreviewContent()}</div>
        </div>
        {/* <div className="flex gap-2 mt-4">
          <Button onClick={() => downloadImage("svg")} className="gap-1.5">
            <Download className="h-4 w-4" />
            SVG
          </Button>
          <Button onClick={() => downloadImage("png")} className="gap-1.5">
            <Download className="h-4 w-4" />
            PNG
          </Button>
          <Button onClick={() => downloadImage("jpeg")} className="gap-1.5">
            <Download className="h-4 w-4" />
            JPEG
          </Button>
        </div> */}
        <div className="mt-6 glass-morphism rounded-lg border border-white/10 p-4">
          <h3 className="text-lg font-medium mb-2">About OG Images</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Open Graph (OG) images are essential for creating engaging social media previews when your content is shared online.
          </p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex gap-2 items-start">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Standard size: 1200×630 pixels for optimal display.</span>
            </li>
            <li className="flex gap-2 items-start">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
              <span>Supported formats: PNG, and JPEG.</span>
            </li>
            {/* <li className="flex gap-2 items-start">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
              <span>High-quality downloads ensure crisp visuals across platforms.</span>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;