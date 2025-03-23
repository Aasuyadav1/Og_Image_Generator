// Pattern types
export type PatternType = 'grid' | 'dots' | 'graph' | 'diagonal' | 'honeycomb' | 'noise';

// Pattern settings interface
export interface PatternSettings {
  type: PatternType;
  color: string;
  opacity: number;
  scale: number;
  background: string;
}

// Default pattern settings
export const defaultPatternSettings: PatternSettings = {
  type: 'grid',
  color: '#ffffff',
  opacity: 0.1,
  scale: 20,
  background: 'linear-gradient(225deg, #2A2A2A 0%, #121212 100%)',
};

// Function to generate SVG pattern URL
export const generatePatternUrl = (settings: PatternSettings): string => {
  const { type, color, opacity, scale } = settings;
  let svgContent = '';
  
  // Parse the color and apply opacity
  const colorWithOpacity = parseColorWithOpacity(color, opacity);
  
  switch (type) {
    case 'grid':
      svgContent = `
        <svg width="${scale * 2}" height="${scale * 2}" viewBox="0 0 ${scale * 2} ${scale * 2}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${scale * 2}" height="${scale * 2}" fill="none"/>
          <path d="M ${scale} 0 L ${scale} ${scale * 2}" stroke="${colorWithOpacity}" stroke-width="1"/>
          <path d="M ${scale * 2} ${scale} L 0 ${scale}" stroke="${colorWithOpacity}" stroke-width="1"/>
        </svg>
      `;
      break;
    case 'dots':
      svgContent = `
        <svg width="${scale * 2}" height="${scale * 2}" viewBox="0 0 ${scale * 2} ${scale * 2}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${scale * 2}" height="${scale * 2}" fill="none"/>
          <circle cx="${scale}" cy="${scale}" r="1.5" fill="${colorWithOpacity}"/>
          <circle cx="${scale * 2}" cy="${scale * 2}" r="1.5" fill="${colorWithOpacity}"/>
          <circle cx="${scale * 2}" cy="0" r="1.5" fill="${colorWithOpacity}"/>
          <circle cx="0" cy="${scale * 2}" r="1.5" fill="${colorWithOpacity}"/>
          <circle cx="0" cy="0" r="1.5" fill="${colorWithOpacity}"/>
        </svg>
      `;
      break;
    case 'graph':
      svgContent = `
        <svg width="${scale * 2}" height="${scale * 2}" viewBox="0 0 ${scale * 2} ${scale * 2}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${scale * 2}" height="${scale * 2}" fill="none"/>
          <path d="M ${scale / 4} 0 L ${scale / 4} ${scale * 2}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M ${scale / 2} 0 L ${scale / 2} ${scale * 2}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M ${scale * 3/4} 0 L ${scale * 3/4} ${scale * 2}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M ${scale} 0 L ${scale} ${scale * 2}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M ${scale * 5/4} 0 L ${scale * 5/4} ${scale * 2}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M ${scale * 6/4} 0 L ${scale * 6/4} ${scale * 2}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M ${scale * 7/4} 0 L ${scale * 7/4} ${scale * 2}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M 0 ${scale / 4} L ${scale * 2} ${scale / 4}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M 0 ${scale / 2} L ${scale * 2} ${scale / 2}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M 0 ${scale * 3/4} L ${scale * 2} ${scale * 3/4}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M 0 ${scale} L ${scale * 2} ${scale}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M 0 ${scale * 5/4} L ${scale * 2} ${scale * 5/4}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M 0 ${scale * 6/4} L ${scale * 2} ${scale * 6/4}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
          <path d="M 0 ${scale * 7/4} L ${scale * 2} ${scale * 7/4}" stroke="${colorWithOpacity}" stroke-width="0.5"/>
        </svg>
      `;
      break;
    case 'diagonal':
      svgContent = `
        <svg width="${scale * 2}" height="${scale * 2}" viewBox="0 0 ${scale * 2} ${scale * 2}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${scale * 2}" height="${scale * 2}" fill="none"/>
          <path d="M 0 0 L ${scale * 2} ${scale * 2}" stroke="${colorWithOpacity}" stroke-width="1"/>
          <path d="M 0 ${scale * 2} L ${scale * 2} 0" stroke="${colorWithOpacity}" stroke-width="1"/>
        </svg>
      `;
      break;
    case 'honeycomb':
      svgContent = `
        <svg width="${scale * 3}" height="${scale * Math.sqrt(3)}" viewBox="0 0 ${scale * 3} ${scale * Math.sqrt(3)}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${scale * 3}" height="${scale * Math.sqrt(3)}" fill="none"/>
          <path d="M ${scale} 0 L ${scale * 2} 0 L ${scale * 2.5} ${scale * Math.sqrt(3) / 2} L ${scale * 2} ${scale * Math.sqrt(3)} L ${scale} ${scale * Math.sqrt(3)} L ${scale / 2} ${scale * Math.sqrt(3) / 2} Z" stroke="${colorWithOpacity}" fill="none" stroke-width="1"/>
          <path d="M ${scale * 2.5} ${scale * Math.sqrt(3) / 2} L ${scale * 3} ${scale * Math.sqrt(3) / 2}" stroke="${colorWithOpacity}" stroke-width="1"/>
          <path d="M ${scale / 2} ${scale * Math.sqrt(3) / 2} L 0 ${scale * Math.sqrt(3) / 2}" stroke="${colorWithOpacity}" stroke-width="1"/>
          <path d="M ${scale * 2} 0 L ${scale * 2} 0" stroke="${colorWithOpacity}" stroke-width="1"/>
          <path d="M ${scale} ${scale * Math.sqrt(3)} L ${scale} ${scale * Math.sqrt(3)}" stroke="${colorWithOpacity}" stroke-width="1"/>
        </svg>
      `;
      break;
    case 'noise':
      // For noise we'll create a simple pattern with random dots
      svgContent = `
        <svg width="${scale * 4}" height="${scale * 4}" viewBox="0 0 ${scale * 4} ${scale * 4}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${scale * 4}" height="${scale * 4}" fill="none"/>
          ${generateNoiseDots(scale * 4, scale * 4, 40, colorWithOpacity)}
        </svg>
      `;
      break;
    default:
      svgContent = `
        <svg width="${scale * 2}" height="${scale * 2}" viewBox="0 0 ${scale * 2} ${scale * 2}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${scale * 2}" height="${scale * 2}" fill="none"/>
          <path d="M ${scale} 0 L ${scale} ${scale * 2}" stroke="${colorWithOpacity}" stroke-width="1"/>
          <path d="M ${scale * 2} ${scale} L 0 ${scale}" stroke="${colorWithOpacity}" stroke-width="1"/>
        </svg>
      `;
  }
  
  const encodedSvg = encodeURIComponent(svgContent.trim());
  return `url("data:image/svg+xml,${encodedSvg}")`;
};

// Helper function to generate random dots for noise pattern
const generateNoiseDots = (width: number, height: number, count: number, color: string): string => {
  let dots = '';
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
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // Handle rgb
  if (color.startsWith('rgb(')) {
    const rgb = color.substring(4, color.length - 1).split(',').map(c => parseInt(c.trim(), 10));
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
  }
  
  // Handle rgba
  if (color.startsWith('rgba(')) {
    const rgba = color.substring(5, color.length - 1).split(',');
    const rgb = rgba.slice(0, 3).map(c => parseInt(c.trim(), 10));
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
  }
  
  // Default - just return with opacity
  return color;
};

// Generate social media image dimensions
export const PLATFORM_DIMENSIONS = {
  twitter: { width: 1200, height: 630, label: 'X / Twitter' },
  linkedin: { width: 1200, height: 627, label: 'LinkedIn' },
  facebook: { width: 1200, height: 630, label: 'Facebook' },
  discord: { width: 1200, height: 675, label: 'Discord' }
};

// Template presets
export interface Template {
  id: string;
  name: string;
  pattern: PatternSettings;
  content: {
    title: string;
    subtitle: string;
    logo?: string;
  };
}

export const TEMPLATES: Template[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    pattern: {
      type: 'grid',
      color: '#ffffff',
      opacity: 0.1,
      scale: 20,
      background: 'linear-gradient(225deg, #2A2A2A 0%, #121212 100%)'
    },
    content: {
      title: 'Clean & Minimal Design',
      subtitle: 'Perfect for professional content'
    }
  },
  {
    id: 'gradient',
    name: 'Gradient',
    pattern: {
      type: 'dots',
      color: '#ffffff',
      opacity: 0.15,
      scale: 15,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    content: {
      title: 'Gradient Background',
      subtitle: 'Eye-catching and modern'
    }
  },
  {
    id: 'tech',
    name: 'Tech',
    pattern: {
      type: 'graph',
      color: '#00f2fe',
      opacity: 0.2,
      scale: 25,
      background: 'linear-gradient(90deg, #0C0F13 0%, #151A22 100%)'
    },
    content: {
      title: 'Technology Theme',
      subtitle: 'For tech products and services'
    }
  },
  {
    id: 'geometric',
    name: 'Geometric',
    pattern: {
      type: 'honeycomb',
      color: '#ffffff',
      opacity: 0.08,
      scale: 30,
      background: 'linear-gradient(60deg, #29323c 0%, #485563 100%)'
    },
    content: {
      title: 'Geometric Patterns',
      subtitle: 'Modern and architectural'
    }
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    pattern: {
      type: 'diagonal',
      color: '#ffffff',
      opacity: 0.1,
      scale: 20,
      background: 'linear-gradient(90deg, #FF416C 0%, #FF4B2B 100%)'
    },
    content: {
      title: 'Vibrant & Energetic',
      subtitle: 'Stand out from the crowd'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    pattern: {
      type: 'dots',
      color: '#ffffff',
      opacity: 0.12,
      scale: 18,
      background: 'linear-gradient(90deg, #4b6cb7 0%, #182848 100%)'
    },
    content: {
      title: 'Deep Ocean Theme',
      subtitle: 'Calming and professional'
    }
  },
  {
    id: 'purple-haze',
    name: 'Purple Haze',
    pattern: {
      type: 'noise',
      color: '#ffffff',
      opacity: 0.07,
      scale: 30,
      background: 'linear-gradient(225deg, #FF057C 0%, #8D0B93 50%, #321575 100%)'
    },
    content: {
      title: 'Purple Haze Effect',
      subtitle: 'Creative and distinctive'
    }
  },
  {
    id: 'fresh',
    name: 'Fresh',
    pattern: {
      type: 'grid',
      color: '#ffffff',
      opacity: 0.08,
      scale: 15,
      background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)'
    },
    content: {
      title: 'Fresh & Modern Look',
      subtitle: 'Bright and optimistic design'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight',
    pattern: {
      type: 'honeycomb',
      color: '#4338CA',
      opacity: 0.15,
      scale: 25,
      background: 'linear-gradient(90deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
    },
    content: {
      title: 'Midnight Theme',
      subtitle: 'Elegant and mysterious'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    pattern: {
      type: 'dots',
      color: '#ffffff',
      opacity: 0.12,
      scale: 20,
      background: 'linear-gradient(90deg, #f12711 0%, #f5af19 100%)'
    },
    content: {
      title: 'Sunset Vibes',
      subtitle: 'Warm and inviting'
    }
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    pattern: {
      type: 'grid',
      color: '#ffffff',
      opacity: 0.07,
      scale: 15,
      background: '#1A1A1A'
    },
    content: {
      title: 'Monochrome Design',
      subtitle: 'Timeless and elegant'
    }
  },
  {
    id: 'teal-delight',
    name: 'Teal Delight',
    pattern: {
      type: 'diagonal',
      color: '#ffffff',
      opacity: 0.1,
      scale: 25,
      background: 'linear-gradient(90deg, #8360c3 0%, #2ebf91 100%)'
    },
    content: {
      title: 'Teal Delight Theme',
      subtitle: 'Fresh and professional'
    }
  }
];
