import leffPen from "../../public/patterns/center.png"
import RightPen from "../../public/patterns/oggen.png"
import overlay from "../../public/patterns/overl.png"
import center from "../../public/patterns/cen.png"


export type PatternType =
  | "grid"
  | "dots"
  | "graph"
  | "diagonal"
  | "honeycomb"
  | "noise";

// Pattern settings interface
export interface PatternSettings {
  type: PatternType;
  color: string;
  opacity: number;
  scale: number;
}

// Default pattern settings
export const defaultPatternSettings: PatternSettings = {
  type: "grid",
  color: "#ffffff",
  opacity: 0.1,
  scale: 20,
};

// Function to generate SVG pattern URL
export const generatePatternUrl = (settings: PatternSettings): string => {
  const { type, color, opacity, scale } = settings;
  let svgContent = "";

  // Parse the color and apply opacity
  const colorWithOpacity = parseColorWithOpacity(color, opacity);

  switch (type) {
    case "grid":
      svgContent = `
        <svg width="${scale * 2}" height="${scale * 2}" viewBox="0 0 ${
        scale * 2
      } ${scale * 2}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${scale * 2}" height="${scale * 2}" fill="none"/>
          <path d="M ${scale} 0 L ${scale} ${
        scale * 2
      }" stroke="${colorWithOpacity}" stroke-width="1"/>
          <path d="M ${
            scale * 2
          } ${scale} L 0 ${scale}" stroke="${colorWithOpacity}" stroke-width="1"/>
        </svg>
      `;
      break;
    case "dots":
      svgContent = `
        <svg width="${scale * 2}" height="${scale * 2}" viewBox="0 0 ${
        scale * 2
      } ${scale * 2}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${scale * 2}" height="${scale * 2}" fill="none"/>
          <circle cx="${scale}" cy="${scale}" r="1.5" fill="${colorWithOpacity}"/>
          <circle cx="${scale * 2}" cy="${
        scale * 2
      }" r="1.5" fill="${colorWithOpacity}"/>
          <circle cx="${scale * 2}" cy="0" r="1.5" fill="${colorWithOpacity}"/>
          <circle cx="0" cy="${scale * 2}" r="1.5" fill="${colorWithOpacity}"/>
          <circle cx="0" cy="0" r="1.5" fill="${colorWithOpacity}"/>
        </svg>
      `;
      break;
    case "graph":
      svgContent = `
        <svg width="${scale * 2}" height="${scale * 2}" viewBox="0 0 ${
        scale * 2
      } ${scale * 2}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${scale * 2}" height="${scale * 2}" fill="none"/>
          <path d="M ${scale / 4} 0 L ${scale / 4} ${
        scale * 2
      }" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M ${scale / 2} 0 L ${scale / 2} ${
        scale * 2
      }" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M ${(scale * 3) / 4} 0 L ${(scale * 3) / 4} ${
        scale * 2
      }" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M ${scale} 0 L ${scale} ${
        scale * 2
      }" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M ${(scale * 5) / 4} 0 L ${(scale * 5) / 4} ${
        scale * 2
      }" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M ${(scale * 6) / 4} 0 L ${(scale * 6) / 4} ${
        scale * 2
      }" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M ${(scale * 7) / 4} 0 L ${(scale * 7) / 4} ${
        scale * 2
      }" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M 0 ${scale / 4} L ${scale * 2} ${
        scale / 4
      }" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M 0 ${scale / 2} L ${scale * 2} ${
        scale / 2
      }" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M 0 ${(scale * 3) / 4} L ${scale * 2} ${
        (scale * 3) / 4
      }" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M 0 ${scale} L ${
        scale * 2
      } ${scale}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M 0 ${(scale * 5) / 4} L ${scale * 2} ${
        (scale * 5) / 4
      }" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M 0 ${(scale * 6) / 4} L ${scale * 2} ${
        (scale * 6) / 4
      }" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M 0 ${(scale * 7) / 4} L ${scale * 2} ${
        (scale * 7) / 4
      }" stroke="${colorWithOpacity}" stroke-width="0.5"/>
        </svg>
      `;
      break;
    case "diagonal":
      svgContent = `
        <svg width="${scale * 2}" height="${scale * 2}" viewBox="0 0 ${
        scale * 2
      } ${scale * 2}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${scale * 2}" height="${scale * 2}" fill="none"/>
          <path d="M 0 0 L ${scale * 2} ${
        scale * 2
      }" stroke="${colorWithOpacity}" stroke-width="1"/>
          <path d="M 0 ${scale * 2} L ${
        scale * 2
      } 0" stroke="${colorWithOpacity}" stroke-width="1"/>
        </svg>
      `;
      break;
    case "honeycomb":
      svgContent = `
        <svg width="${scale * 3}" height="${
        scale * Math.sqrt(3)
      }" viewBox="0 0 ${scale * 3} ${
        scale * Math.sqrt(3)
      }" xmlns="http://www.w3.org/2000/svg">
          <rect width="${scale * 3}" height="${
        scale * Math.sqrt(3)
      }" fill="none"/>
          <path d="M ${scale} 0 L ${scale * 2} 0 L ${scale * 2.5} ${
        (scale * Math.sqrt(3)) / 2
      } L ${scale * 2} ${scale * Math.sqrt(3)} L ${scale} ${
        scale * Math.sqrt(3)
      } L ${scale / 2} ${
        (scale * Math.sqrt(3)) / 2
      } Z" stroke="${colorWithOpacity}" fill="none" stroke-width="1"/>
          <path d="M ${scale * 2.5} ${(scale * Math.sqrt(3)) / 2} L ${
        scale * 3
      } ${
        (scale * Math.sqrt(3)) / 2
      }" stroke="${colorWithOpacity}" stroke-width="1"/>
          <path d="M ${scale / 2} ${(scale * Math.sqrt(3)) / 2} L 0 ${
        (scale * Math.sqrt(3)) / 2
      }" stroke="${colorWithOpacity}" stroke-width="1"/>
          <path d="M ${scale * 2} 0 L ${
        scale * 2
      } 0" stroke="${colorWithOpacity}" stroke-width="1"/>
          <path d="M ${scale} ${scale * Math.sqrt(3)} L ${scale} ${
        scale * Math.sqrt(3)
      }" stroke="${colorWithOpacity}" stroke-width="1"/>
        </svg>
      `;
      break;
    case "noise":
      // For noise we'll create a simple pattern with random dots
      svgContent = `
        <svg width="${scale * 4}" height="${scale * 4}" viewBox="0 0 ${
        scale * 4
      } ${scale * 4}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${scale * 4}" height="${scale * 4}" fill="none"/>
          ${generateNoiseDots(scale * 4, scale * 4, 40, colorWithOpacity)}
        </svg>
      `;
      break;
    default:
      svgContent = `
        <svg width="${scale * 2}" height="${scale * 2}" viewBox="0 0 ${
        scale * 2
      } ${scale * 2}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${scale * 2}" height="${scale * 2}" fill="none"/>
          <path d="M ${scale} 0 L ${scale} ${
        scale * 2
      }" stroke="${colorWithOpacity}" stroke-width="1"/>
          <path d="M ${
            scale * 2
          } ${scale} L 0 ${scale}" stroke="${colorWithOpacity}" stroke-width="1"/>
        </svg>
      `;
  }

  const encodedSvg = encodeURIComponent(svgContent.trim());
  return `url("data:image/svg+xml,${encodedSvg}")`;
};

// Helper function to generate random dots for noise pattern
const generateNoiseDots = (
  width: number,
  height: number,
  count: number,
  color: string
): string => {
  let dots = "";
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 1.5 + 0.5;
    dots += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}"/>`;
  }
  return dots;
};

// Helper function to parse color and apply opacity
const parseColorWithOpacity = (color: string, opacity: number): string => {
  // Handle hex
  if (color?.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Handle rgb
  if (color?.startsWith("rgb(")) {
    const rgb = color
      .substring(4, color.length - 1)
      .split(",")
      .map((c) => parseInt(c.trim(), 10));
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
  }

  // Handle rgba
  if (color?.startsWith("rgba(")) {
    const rgba = color.substring(5, color.length - 1).split(",");
    const rgb = rgba.slice(0, 3).map((c) => parseInt(c.trim(), 10));
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
  }

  // Default - just return with opacity
  return color;
};

// Generate social media image dimensions
export const PLATFORM_DIMENSIONS = {
  twitter: { width: 1200, height: 630, label: "X / Twitter" },
  linkedin: { width: 1200, height: 627, label: "LinkedIn" },
  facebook: { width: 1200, height: 630, label: "Facebook" },
  discord: { width: 1200, height: 675, label: "Discord" },
};

// Template presets
export interface Template {
  id: string;
  name: string;
  background: string;
  pattern: PatternSettings;
  content: {
    title: string;
    subtitle: string;
    image?: string;
    layout: 'centered' | 'left-image' | 'right-image' | 'bottom-image' | 'top-image' | 'overlay';
    textAlign?: 'left' | 'center' | 'right';
  };
}

export const TEMPLATES: Template[] = [
  {
    id: "minimal",
    name: "Minimal",
    pattern: {
      type: "grid",
      color: "#ffffff",
      opacity: 0.1,
      scale: 20,
    },
    background: "linear-gradient(225deg, #2A2A2A 0%, #121212 100%)",
    content: {
      title: "Clean & Minimal Design",
      subtitle: "Perfect for professional content",
      layout: "centered",
      textAlign: "center",
    },
  },
  {
    id: "split-right",
    name: "Split Content",
    pattern: {
      type: "dots",
      color: "#ffffff",
      opacity: 0.15,
      scale: 15,
    },
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    content: {
      title: "Product Showcase",
      subtitle: "Feature your product with a clean layout",
      image: RightPen,
      layout: "right-image",
      textAlign: "left"
    },
  },
  {
    id: "featured-image",
    name: "Featured Image",
    pattern: {
      type: "diagonal",
      color: "#ffffff",
      opacity: 0.08,
      scale: 20,
    },
    background: "linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%)",
    content: {
      title: "Bottom Featured Image",
      subtitle: "Great for showcasing screenshots or products",
      layout: "bottom-image",
      textAlign: "center",
      image: center
    },
  },
  // {
  //   id: "header-showcase",
  //   name: "Header Image",
  //   pattern: {
  //     type: "honeycomb",
  //     color: "#ffffff",
  //     opacity: 0.07,
  //     scale: 30,
  //   },
  //   background: "linear-gradient(60deg, #29323c 0%, #485563 100%)",
  //   content: {
  //     title: "Content Below Image",
  //     subtitle: "Perfect for article or blog previews",
  //     image: "/api/placeholder/900/350",
  //     layout: "top-image",
  //     textAlign: "center"
  //   },
  // },
  {
    id: "split-left",
    name: "Left Image",
    pattern: {
      type: "dots",
      color: "#ffffff",
      opacity: 0.07,
      scale: 30,
    },
    background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
    content: {
      title: "Visual First Design",
      subtitle: "Lead with your visuals for more impact",
      image: leffPen,
      layout: "left-image",
      textAlign: "right"
    },
  },
  {
    id: "overlay-image",
    name: "Text Overlay",
    pattern: {
      type: "grid",
      color: "#ffffff",
      opacity: 0.08,
      scale: 15,
    },
    background: "linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)",
    content: {
      title: "Text Over Image",
      subtitle: "Make your content stand out",
      image: overlay,
      layout: "overlay",
      textAlign: "center"
    },
  }
];