import { useRef, useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";
import { PatternSettings } from "@/lib/pattern-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TemplateSelector from "./TemplateSelector";

interface ImagePreviewProps {
  content: {
    title: string;
    subtitle: string;
    image?: string;
    layout:
      | "centered"
      | "left-image"
      | "right-image"
      | "bottom-image"
      | "top-image"
      | "overlay";
    textAlign?: "left" | "center" | "right";
  };
  patternStyle: PatternSettings;
  background: string;
  patternUrl: string;
  onSelectTemplate: (template: any) => void;
}

const ImagePreview = ({
  content,
  patternStyle,
  background,
  patternUrl,
  onSelectTemplate,
}: ImagePreviewProps) => {
  const previewRef = useRef<HTMLImageElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string>("");

  // Fetch image as base64
  const fetchImageAsBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error fetching image:", error);
      return "";
    }
  };

  // Generate SVG content for preview and download
  const generateSvgContent = useCallback(
    async (width: number, height: number, isPreview: boolean = true) => {
      const { layout, title, subtitle, image, textAlign } = content;
      const padding = isPreview ? 20 : 80; // p-8 equivalent
      const titleFontSize = isPreview ? 24 : 60; // Matches text-xl to text-3xl scaling
      const subtitleFontSize = isPreview ? 14 : 36; // Matches text-sm to text-base scaling
      const patternSize = patternStyle.scale * (isPreview ? 1 : 2);
      const marginTop = isPreview ? 14 : 56; // mt-14 equivalent
      const borderRadius = isPreview ? 8 : 32; // Tailwind rounded-xl (16px) scaled

      // Fetch image as base64 if it exists
      const imageBase64 = image ? await fetchImageAsBase64(image) : "";

      // Wrap text function for SVG
      const wrapText = (
        text: string,
        maxWidth: number,
        fontSize: number
      ): { lines: string[]; lineHeight: number } => {
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
        let x1 = "0%",
          y1 = "0%",
          x2 = "100%",
          y2 = "0%";
        const numAngle = parseInt(angle);
        if (numAngle >= 0 && numAngle < 90) {
          x1 = "0%";
          y1 = "100%";
          x2 = "100%";
          y2 = "0%";
        } else if (numAngle >= 90 && numAngle < 180) {
          x1 = "0%";
          y1 = "0%";
          x2 = "100%";
          y2 = "100%";
        } else if (numAngle >= 180 && numAngle < 270) {
          x1 = "100%";
          y1 = "0%";
          x2 = "0%";
          y2 = "100%";
        } else {
          x1 = "100%";
          y1 = "100%";
          x2 = "0%";
          y2 = "0%";
        }
        const colorRegex =
          /(#[0-9A-Fa-f]+|rgb\([^)]+\)|rgba\([^)]+\))\s*(\d+%)?/g;
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
            ${colors
              .map(
                (c) => `<stop offset="${c.position}" stop-color="${c.color}" />`
              )
              .join("")}
          </linearGradient>
        `;
        fillStyle = "url(#backgroundGradient)";
      }

      // Extract pattern URL
      let patternUrlExtracted = patternUrl;
      const patternMatch = patternUrl.match(/url\("([^"]+)"\)/);
      if (patternMatch && patternMatch[1]) {
        patternUrlExtracted = patternMatch[1];
      }

      // Base SVG structure with mask definitions for rounded corners
      let svgContent = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            ${gradientDef}
            ${
              patternUrlExtracted
                ? `
              <pattern id="pattern" patternUnits="userSpaceOnUse" width="${patternSize}" height="${patternSize}">
                <image href="${patternUrlExtracted}" width="${patternSize}" height="${patternSize}" />
              </pattern>
            `
                : ""
            }
            
            <mask id="leftImageRoundMask">
    <rect width="${width}" height="${height}" fill="black" />
    <path d="
      M 0 ${marginTop}
      H ${width / 2 - borderRadius}
      Q ${width / 2} ${marginTop} ${width / 2} ${marginTop + borderRadius}
      V ${height}
      H 0
      Z
    " fill="white" />
  </mask>
  
  <!-- Right image mask - only top-left corner rounded -->
  <mask id="rightImageRoundMask">
    <rect width="${width}" height="${height}" fill="black" />
    <path d="
      M ${width / 2} ${marginTop + borderRadius}
      Q ${width / 2} ${marginTop} ${width / 2 + borderRadius} ${marginTop}
      H ${width}
      V ${height}
      H ${width / 2}
      Z
    " fill="white" />
  </mask>
  
  <!-- Rounded rectangle masks - only rounded at top -->
  <mask id="leftImageRoundMask">
    <rect width="${width}" height="${height}" fill="black" />
    <path d="
      M 0 ${marginTop + borderRadius}
      Q 0 ${marginTop} ${borderRadius} ${marginTop}
      H ${width / 2 - borderRadius}
      Q ${width / 2} ${marginTop} ${width / 2} ${marginTop + borderRadius}
      V ${height}
      H 0
      Z
    " fill="white" />
  </mask>
  
  <mask id="rightImageRoundMask">
    <rect width="${width}" height="${height}" fill="black" />
    <path d="
      M ${width / 2} ${marginTop + borderRadius}
      Q ${width / 2} ${marginTop} ${width / 2 + borderRadius} ${marginTop}
      H ${width - borderRadius}
      Q ${width} ${marginTop} ${width} ${marginTop + borderRadius}
      V ${height}
      H ${width / 2}
      Z
    " fill="white" />
  </mask>
  
  <mask id="bottomImageRoundMask">
    <rect width="${width}" height="${height}" y="${100}" fill="black" />
    <path d="
      M ${width * 0.025} ${height * 0.55 + borderRadius}
      Q ${width * 0.025} ${height * 0.55} ${width * 0.025 + borderRadius} ${
        height * 0.55
      }
      H ${width * 0.975 - borderRadius}
      Q ${width * 0.975} ${height * 0.55} ${width * 0.975} ${
        height * 0.55 + borderRadius
      }
      V ${2000}
      H ${width * 0.025}
      Z
    " fill="white" />
  </mask>
          </defs>
          <rect width="${width}" height="${height}" fill="${fillStyle}" />
          ${
            patternUrlExtracted
              ? `<rect width="${width}" height="${height}" fill="url(#pattern)" />`
              : ""
          }
      `;

      switch (layout) {
        case "left-image": {
          if (imageBase64) {
            // Use mask to create rounded rectangle for image
            svgContent += `
              <g mask="url(#leftImageRoundMask)">
                <image href="${imageBase64}" x="0" y="${marginTop}" width="${
              width / 2
            }" height="${
              height - marginTop
            }" preserveAspectRatio="xMaxYMid slice" />
              </g>
            `;
          }
          const textX = imageBase64 ? width / 2 + padding : padding;
          const textWidth = imageBase64
            ? width / 2 - padding * 2
            : width - padding * 2;
          const { lines: titleLines, lineHeight: titleLineHeight } =
            await wrapText(title, textWidth, titleFontSize);
          const { lines: subtitleLines, lineHeight: subtitleLineHeight } =
            await wrapText(subtitle, textWidth, subtitleFontSize);
          const totalTextHeight =
            titleLines.length * titleLineHeight +
            subtitleLines.length * subtitleLineHeight +
            (isPreview ? 6 : 20);
          const textYStart = (height - totalTextHeight) / 2;
          titleLines.forEach((line, i) => {
            svgContent += `
              <text x="${textX}" y="${
              textYStart + i * titleLineHeight
            }" font-family="Inter, sans-serif" font-size="${titleFontSize}" font-weight="bold" fill="white" text-anchor="start" dominant-baseline="middle">${escapeHtml(
              line
            )}</text>
            `;
          });
          subtitleLines.forEach((line, i) => {
            svgContent += `
              <text x="${textX}" y="${
              textYStart +
              titleLines.length * titleLineHeight +
              (isPreview ? 6 : 20) +
              i * subtitleLineHeight
            }" font-family="Inter, sans-serif" font-size="${subtitleFontSize}" fill="rgba(255,255,255,0.8)" text-anchor="start" dominant-baseline="middle">${escapeHtml(
              line
            )}</text>
            `;
          });
          break;
        }
        case "right-image": {
          const textX = padding;
          const textWidth = imageBase64
            ? width / 2 - padding * 2
            : width - padding * 2;
          const { lines: titleLines, lineHeight: titleLineHeight } =
            await wrapText(title, textWidth, titleFontSize);
          const { lines: subtitleLines, lineHeight: subtitleLineHeight } =
            await wrapText(subtitle, textWidth, subtitleFontSize);
          const totalTextHeight =
            titleLines.length * titleLineHeight +
            subtitleLines.length * subtitleLineHeight +
            (isPreview ? 6 : 20);
          const textYStart = (height - totalTextHeight) / 2;
          titleLines.forEach((line, i) => {
            svgContent += `
              <text x="${textX}" y="${
              textYStart + i * titleLineHeight
            }" font-family="Inter, sans-serif" font-size="${titleFontSize}" font-weight="bold" fill="white" text-anchor="start" dominant-baseline="middle">${escapeHtml(
              line
            )}</text>
            `;
          });
          subtitleLines.forEach((line, i) => {
            svgContent += `
              <text x="${textX}" y="${
              textYStart +
              titleLines.length * titleLineHeight +
              (isPreview ? 6 : 20) +
              i * subtitleLineHeight
            }" font-family="Inter, sans-serif" font-size="${subtitleFontSize}" fill="rgba(255,255,255,0.8)" text-anchor="start" dominant-baseline="middle">${escapeHtml(
              line
            )}</text>
            `;
          });
          if (imageBase64) {
            // Use mask to create rounded rectangle for image
            svgContent += `
              <g mask="url(#rightImageRoundMask)">
                <image href="${imageBase64}" x="${
              width / 2
            }" y="${marginTop}" width="${width / 2}" height="${
              height - marginTop
            }" preserveAspectRatio="xMinYMid slice" />
              </g>
            `;
          }
          break;
        }
        case "bottom-image": {
          const textHeight = 400 * 0.3; // 30% of height for text
          const imageHeight = 450 * 0.9; // 70% of height for image
          const gap = isPreview ? 0 : 16; // 4px gap in preview, 16px in download
          const { lines: titleLines, lineHeight: titleLineHeight } =
            await wrapText(title, width - padding * 2, titleFontSize);
          const { lines: subtitleLines, lineHeight: subtitleLineHeight } =
            await wrapText(subtitle, width - padding * 2, subtitleFontSize);
          const totalTextHeight =
            titleLines.length * titleLineHeight +
            subtitleLines.length * subtitleLineHeight +
            (isPreview ? 6 : 20);
          const textYStart = (textHeight - totalTextHeight) / 2; // Center text in its 30% area
          titleLines.forEach((line, i) => {
            svgContent += `
              <text x="${width / 2}" y="${
              textYStart + i * titleLineHeight
            }" font-family="Inter, sans-serif" font-size="${titleFontSize}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${escapeHtml(
              line
            )}</text>
            `;
          });
          subtitleLines.forEach((line, i) => {
            svgContent += `
              <text x="${width / 2}" y="${
              textYStart +
              titleLines.length * titleLineHeight +
              (isPreview ? 6 : 20) +
              i * subtitleLineHeight
            }" font-family="Inter, sans-serif" font-size="${subtitleFontSize}" fill="rgba(255,255,255,0.8)" text-anchor="middle" dominant-baseline="middle">${escapeHtml(
              line
            )}</text>
            `;
          });
          if (imageBase64) {
            // Image starts after text with small gap and extends to bottom
            const imageYStart = textHeight + gap;
            const imageHeight = height - imageYStart; // Extend to bottom

            // Update mask to only round top corners
            svgContent = svgContent.replace(
              '<mask id="bottomImageRoundMask">',
              `<mask id="bottomImageRoundMask">
                <rect width="${width}" height="${height}" fill="black" />
                <path d="
                  M ${width * 0.025} ${imageYStart + borderRadius}
                  Q ${width * 0.025} ${imageYStart} ${
                width * 0.025 + borderRadius
              } ${imageYStart}
                  H ${width * 0.975 - borderRadius}
                  Q ${width * 0.975} ${imageYStart} ${width * 0.975} ${
                imageYStart + borderRadius
              }
                  V ${height}
                  H ${width * 0.025}
                  Z
                " fill="white" />`
            );

            svgContent += `
              <g mask="url(#bottomImageRoundMask)">
                <image href="${imageBase64}" x="${
              width * 0.025
            }" y="${imageYStart}" width="${
              width * 0.95
            }" height="${imageHeight}" preserveAspectRatio="xMidYMid slice" />
              </g>
            `;
          }
          break;
        }
        case "top-image": {
          if (imageBase64) {
            // Top image doesn't need special rounding since it's against the top edge
            svgContent += `<image href="${imageBase64}" x="0" y="0" width="${width}" height="${
              height / 2
            }" preserveAspectRatio="xMidYMid slice" />`;
          }
          const textHeight = imageBase64 ? height / 2 : height;
          const textYStartOffset = imageBase64 ? height / 2 : 0;
          const { lines: titleLines, lineHeight: titleLineHeight } =
            await wrapText(title, width - padding * 2, titleFontSize);
          const { lines: subtitleLines, lineHeight: subtitleLineHeight } =
            await wrapText(subtitle, width - padding * 2, subtitleFontSize);
          const totalTextHeight =
            titleLines.length * titleLineHeight +
            subtitleLines.length * subtitleLineHeight +
            (isPreview ? 6 : 20);
          const textYStart =
            textYStartOffset + (textHeight - totalTextHeight) / 2;
          const textAnchor =
            textAlign === "left"
              ? "start"
              : textAlign === "right"
              ? "end"
              : "middle";
          const xPos =
            textAlign === "left"
              ? padding
              : textAlign === "right"
              ? width - padding
              : width / 2;
          titleLines.forEach((line, i) => {
            svgContent += `
              <text x="${xPos}" y="${
              textYStart + i * titleLineHeight
            }" font-family="Inter, sans-serif" font-size="${titleFontSize}" font-weight="bold" fill="white" text-anchor="${textAnchor}" dominant-baseline="middle">${escapeHtml(
              line
            )}</text>
            `;
          });
          subtitleLines.forEach((line, i) => {
            svgContent += `
              <text x="${xPos}" y="${
              textYStart +
              titleLines.length * titleLineHeight +
              (isPreview ? 6 : 20) +
              i * subtitleLineHeight
            }" font-family="Inter, sans-serif" font-size="${subtitleFontSize}" fill="rgba(255,255,255,0.8)" text-anchor="${textAnchor}" dominant-baseline="middle">${escapeHtml(
              line
            )}</text>
            `;
          });
          break;
        }
        case "overlay": {
          if (imageBase64) {
            // Overlay image covers entire area without special rounding
            svgContent += `
              <image href="${imageBase64}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" />
              <rect width="${width}" height="${height}" fill="rgba(0,0,0,0.5)" />
            `;
          }
          const { lines: titleLines, lineHeight: titleLineHeight } =
            await wrapText(title, width - padding * 2, titleFontSize);
          const { lines: subtitleLines, lineHeight: subtitleLineHeight } =
            await wrapText(subtitle, width - padding * 2, subtitleFontSize);
          const totalTextHeight =
            titleLines.length * titleLineHeight +
            subtitleLines.length * subtitleLineHeight +
            (isPreview ? 6 : 20);
          const textYStart = (height - totalTextHeight) / 2;
          titleLines.forEach((line, i) => {
            svgContent += `
              <text x="${width / 2}" y="${
              textYStart + i * titleLineHeight
            }" font-family="Inter, sans-serif" font-size="${titleFontSize}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${escapeHtml(
              line
            )}</text>
            `;
          });
          subtitleLines.forEach((line, i) => {
            svgContent += `
              <text x="${width / 2}" y="${
              textYStart +
              titleLines.length * titleLineHeight +
              (isPreview ? 6 : 20) +
              i * subtitleLineHeight
            }" font-family="Inter, sans-serif" font-size="${subtitleFontSize}" fill="rgba(255,255,255,0.8)" text-anchor="middle" dominant-baseline="middle">${escapeHtml(
              line
            )}</text>
            `;
          });
          break;
        }
        case "centered":
        default: {
          const logoMaxWidth = width * 0.3;
          const logoMaxHeight = height * 0.15;
          const { lines: titleLines, lineHeight: titleLineHeight } =
            await wrapText(title, width - padding * 2, titleFontSize);
          const { lines: subtitleLines, lineHeight: subtitleLineHeight } =
            await wrapText(subtitle, width - padding * 2, subtitleFontSize);
          const totalTextHeight =
            titleLines.length * titleLineHeight +
            subtitleLines.length * subtitleLineHeight +
            (isPreview ? 6 : 20);
          const logoHeight = imageBase64 ? logoMaxHeight : 0;
          const totalHeight =
            logoHeight +
            totalTextHeight +
            (imageBase64 ? (isPreview ? 6 : 24) : 0);
          const yStart = (height - totalHeight) / 2;
          if (imageBase64) {
            svgContent += `
              <image href="${imageBase64}" x="${
              (width - logoMaxWidth) / 2
            }" y="${yStart}" width="${logoMaxWidth}" height="${logoMaxHeight}" preserveAspectRatio="xMidYMid meet" />
            `;
          }
          titleLines.forEach((line, i) => {
            svgContent += `
              <text x="${width / 2}" y="${
              yStart +
              logoHeight +
              (imageBase64 ? (isPreview ? 6 : 24) : 0) +
              i * titleLineHeight
            }" font-family="Inter, sans-serif" font-size="${titleFontSize}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${escapeHtml(
              line
            )}</text>
            `;
          });
          subtitleLines.forEach((line, i) => {
            svgContent += `
              <text x="${width / 2}" y="${
              yStart +
              logoHeight +
              (imageBase64 ? (isPreview ? 6 : 24) : 0) +
              titleLines.length * titleLineHeight +
              (isPreview ? 6 : 20) +
              i * subtitleLineHeight
            }" font-family="Inter, sans-serif" font-size="${subtitleFontSize}" fill="rgba(255,255,255,0.8)" text-anchor="middle" dominant-baseline="middle">${escapeHtml(
              line
            )}</text>
            `;
          });
          break;
        }
      }

      svgContent += `</svg>`;
      return svgContent;
    },
    [content, patternStyle, background, patternUrl]
  );

  // Set preview SVG as image src
  useEffect(() => {
    const setPreview = async () => {
      const svgString = await generateSvgContent(600, 315);
      const svgBlob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      setPreviewSrc(svgUrl);
      return () => URL.revokeObjectURL(svgUrl); // Cleanup
    };
    setPreview();
  }, [generateSvgContent]);

  const downloadImage = useCallback(
    async (format: "svg" | "png" | "jpeg") => {
      try {
        const svgContent = await generateSvgContent(1200, 630, false);
        if (format === "svg") {
          const svgBlob = new Blob([svgContent], {
            type: "image/svg+xml;charset=utf-8",
          });
          const svgUrl = URL.createObjectURL(svgBlob);
          const link = document.createElement("a");
          link.download = "og-image.svg";
          link.href = svgUrl;
          link.click();
          URL.revokeObjectURL(svgUrl);
          toast.success("SVG downloaded successfully");
        } else {
          const svgBlob = new Blob([svgContent], {
            type: "image/svg+xml;charset=utf-8",
          });
          const svgUrl = URL.createObjectURL(svgBlob);
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Failed to load SVG"));
            img.src = svgUrl;
          });
          const canvas = document.createElement("canvas");
          canvas.width = 1200;
          canvas.height = 630;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Unable to create canvas context");
          ctx.drawImage(img, 0, 0, 1200, 630);
          URL.revokeObjectURL(svgUrl);
          const link = document.createElement("a");
          link.download = `og-image.${format}`;
          link.href = canvas.toDataURL(
            `image/${format}`,
            format === "jpeg" ? 0.95 : 1.0
          );
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
    [generateSvgContent]
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
          <div className="flex gap-2 w-fit">
            <DropdownMenu>
              <DropdownMenuTrigger className="!ring-none" asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 focus:ring-0 focus:border-0 focus:outline-none focus:ring-offset-0 focus-visible:ring-0"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => downloadImage("svg")}>
                  SVG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadImage("png")}>
                  PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadImage("jpeg")}>
                  JPEG
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div
        className="sticky top-4 mb-4 mt-4 bg-background"
        style={{ position: "-webkit-sticky" }}
      >
        <img
          ref={previewRef}
          src={previewSrc}
          alt="Preview"
          className="aspect-[1200/630] w-full rounded-lg overflow-hidden border border-white/10 shadow-xl animate-scale-in"
        />
        <div className="mt-6 glass-morphism rounded-lg border border-white/10 pt-4 px-4 pb-2">
          {/* <h3 className="text-lg font-medium mb-2">About OG Images</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Open Graph (OG) images are essential for creating engaging social
            media previews when your content is shared online.
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
          </ul> */}
          <TemplateSelector onSelectTemplate={onSelectTemplate} />
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
